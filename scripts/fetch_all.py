"""Stock Info - Daily Data Collection Script

EODHD API에서 미국 주식 데이터를 수집하여 S3에 업로드한다.
수집 항목: 티커 목록 / 펀더멘탈 / 종가

Usage:
    python fetch_all.py                  # Full: 수집 + S3 업로드
    python fetch_all.py --local          # 로컬 저장만 (S3 스킵)
    python fetch_all.py --tickers-only   # 티커 목록만 수집
    python fetch_all.py --limit 10       # 티커 N개만 수집 (테스트용)
"""

import os
import sys
import json
import gzip
import time
import logging
import argparse
from datetime import datetime
from pathlib import Path

import requests
import boto3
from dotenv import load_dotenv

# ── Config ──────────────────────────────────────────────
load_dotenv(Path(__file__).parent / ".env")

EODHD_API_KEY = os.getenv("EODHD_API_KEY")
S3_BUCKET = os.getenv("S3_BUCKET")
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

EXCHANGE = "US"
BASE_URL = "https://eodhd.com/api"
RATE_LIMIT_DELAY = 0.2  # 5 req/sec
MAX_RETRIES = 3
OUTPUT_DIR = Path(__file__).parent / "output"

# ── Logging ─────────────────────────────────────────────
OUTPUT_DIR.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(OUTPUT_DIR / "fetch.log", encoding="utf-8"),
    ],
)
log = logging.getLogger(__name__)


# ── 1. 티커 목록 수집 ──────────────────────────────────
def fetch_ticker_list() -> list[dict]:
    """EODHD exchange-symbol-list에서 US Common Stock만 수집"""
    url = f"{BASE_URL}/exchange-symbol-list/{EXCHANGE}"
    params = {"api_token": EODHD_API_KEY, "fmt": "json"}

    resp = requests.get(url, params=params, timeout=30)
    resp.raise_for_status()
    all_tickers = resp.json()

    # Common Stock만 필터 (ETF, Warrant, Preferred 제외)
    stocks = [t for t in all_tickers if t.get("Type") == "Common Stock"]

    log.info(f"티커 수집: 전체 {len(all_tickers)}개 → Common Stock {len(stocks)}개")
    return stocks


# ── 2. 펀더멘탈 수집 + 변환 ────────────────────────────
def fetch_fundamentals(tickers: list[dict]) -> dict:
    """각 티커의 펀더멘탈을 수집하고 FundamentalData 형식으로 변환"""
    result = {}
    total = len(tickers)
    errors = []

    for i, ticker in enumerate(tickers):
        symbol = ticker["Code"]

        if (i + 1) % 100 == 0 or i == 0:
            log.info(f"펀더멘탈 수집 중: {i + 1}/{total} ({symbol})")

        for attempt in range(MAX_RETRIES):
            try:
                url = f"{BASE_URL}/fundamentals/{symbol}.{EXCHANGE}"
                params = {"api_token": EODHD_API_KEY, "fmt": "json"}
                resp = requests.get(url, params=params, timeout=15)

                if resp.status_code == 429:
                    wait = 60
                    log.warning(f"Rate limit 도달, {wait}초 대기...")
                    time.sleep(wait)
                    continue

                if resp.status_code == 404:
                    log.debug(f"{symbol}: 404 Not Found, 스킵")
                    break

                resp.raise_for_status()
                raw = resp.json()

                transformed = transform_fundamental(raw)
                if transformed:
                    result[symbol] = transformed
                break

            except requests.exceptions.Timeout:
                if attempt == MAX_RETRIES - 1:
                    errors.append({"symbol": symbol, "error": "Timeout"})
                    log.warning(f"{symbol}: 타임아웃 (재시도 {attempt + 1}/{MAX_RETRIES})")
            except Exception as e:
                if attempt == MAX_RETRIES - 1:
                    errors.append({"symbol": symbol, "error": str(e)})
                    log.error(f"{symbol} 실패: {e}")
                else:
                    time.sleep(1)

        time.sleep(RATE_LIMIT_DELAY)

    log.info(f"펀더멘탈 완료: {len(result)}/{total} 성공, {len(errors)}건 에러")

    if errors:
        error_path = OUTPUT_DIR / "errors.json"
        with open(error_path, "w", encoding="utf-8") as f:
            json.dump(errors, f, indent=2, ensure_ascii=False)
        log.info(f"에러 목록 저장: {error_path}")

    return result


def transform_fundamental(raw: dict) -> dict | None:
    """EODHD 원시 데이터 → FundamentalData 형식 변환

    fundamentals.ts의 변환 로직과 동일한 출력을 보장한다.
    """
    general = raw.get("General", {})
    highlights = raw.get("Highlights", {})
    valuation = raw.get("Valuation", {})
    splits = raw.get("SplitsDividends", {})
    technicals = raw.get("Technicals", {})

    if not general.get("Code"):
        return None

    # ── Magic Formula 파생 계산 (fundamentals.ts 로직 복제) ──
    revenue = highlights.get("RevenueTTM") or 0
    op_margin = highlights.get("OperatingMarginTTM") or 0
    computed_ebit = revenue * op_margin

    ebitda = highlights.get("EBITDA") or 0
    ev_ebitda_ratio = valuation.get("EnterpriseValueEbitda") or 0

    if ebitda and ev_ebitda_ratio:
        computed_ev = ebitda * ev_ebitda_ratio
    else:
        computed_ev = highlights.get("MarketCapitalization") or 0

    market_cap = highlights.get("MarketCapitalization") or 0
    computed_nwc = market_cap * 0.15  # Net Working Capital 추정
    computed_nfa = market_cap * 0.25  # Net Fixed Assets 추정

    # EV/EBIT (fundamentals.ts 로직 그대로)
    ev_ebit = None
    if ev_ebitda_ratio and ebitda and ebitda != 0:
        ev_ebit = ev_ebitda_ratio / ebitda

    # Earnings Yield = EBIT / EV
    earnings_yield = None
    if computed_ebit and computed_ev and computed_ev != 0:
        earnings_yield = computed_ebit / computed_ev

    # Return on Capital = EBIT / (NWC + NFA)
    invested_capital = computed_nwc + computed_nfa
    return_on_capital = None
    if computed_ebit and invested_capital and invested_capital != 0:
        return_on_capital = computed_ebit / invested_capital

    return {
        "name": general.get("Name", ""),
        "sector": general.get("Sector", ""),
        "PER": highlights.get("PERatio") or 0,
        "EPS": highlights.get("EarningsShare") or 0,
        "PBR": valuation.get("PriceBookMRQ") or 0,
        "dividendYield": highlights.get("DividendYield") or 0,
        "PEG": highlights.get("PEGRatio"),
        "payoutRatio": splits.get("PayoutRatio"),
        "roe": highlights.get("ReturnOnEquityTTM"),
        "epsGrowth": highlights.get("QuarterlyEarningsGrowthYOY"),
        "revenueGrowth": highlights.get("QuarterlyRevenueGrowthYOY"),
        "evEbitda": valuation.get("EnterpriseValueEbitda"),
        "operatingMargin": highlights.get("OperatingMarginTTM"),
        "profitMargin": highlights.get("ProfitMargin"),
        "evEbit": ev_ebit,
        "EBITDA": highlights.get("EBITDA"),
        "WallStreetTargetPrice": highlights.get("WallStreetTargetPrice"),
        "BookValue": highlights.get("BookValue"),
        "DividendShare": highlights.get("DividendShare"),
        "EPSEstimateCurrentYear": highlights.get("EPSEstimateCurrentYear"),
        "EPSEstimateNextYear": highlights.get("EPSEstimateNextYear"),
        "EPSEstimateNextQuarter": highlights.get("EPSEstimateNextQuarter"),
        "EPSEstimateCurrentQuarter": highlights.get("EPSEstimateCurrentQuarter"),
        "MostRecentQuarter": highlights.get("MostRecentQuarter", ""),
        "ReturnOnAssetsTTM": highlights.get("ReturnOnAssetsTTM"),
        "RevenueTTM": highlights.get("RevenueTTM"),
        "RevenuePerShareTTM": highlights.get("RevenuePerShareTTM"),
        "QuarterlyRevenueGrowthYOY": highlights.get("QuarterlyRevenueGrowthYOY"),
        "GrossProfitTTM": highlights.get("GrossProfitTTM"),
        "QuarterlyEarningsGrowthYOY": highlights.get("QuarterlyEarningsGrowthYOY"),
        "marketCap": str(market_cap),
        "volume": str(technicals.get("Volume") or "0"),
        # Technicals
        "Week52High": technicals.get("52WeekHigh"),
        "Week52Low": technicals.get("52WeekLow"),
        "Day50MA": technicals.get("50DayMA"),
        "Day200MA": technicals.get("200DayMA"),
        # Magic Formula
        "ebit": computed_ebit,
        "enterpriseValue": computed_ev,
        "netWorkingCapital": computed_nwc,
        "netFixedAssets": computed_nfa,
        "earningsYield": earnings_yield,
        "returnOnCapital": return_on_capital,
    }


# ── 3. 종가 수집 (Bulk API) ────────────────────────────
def fetch_close_prices() -> dict:
    """Bulk API로 전 종목 종가를 한 번에 수집"""
    url = f"{BASE_URL}/eod-bulk-last-day/{EXCHANGE}"
    params = {"api_token": EODHD_API_KEY, "fmt": "json"}

    resp = requests.get(url, params=params, timeout=60)
    resp.raise_for_status()
    raw = resp.json()

    prices = {}
    for item in raw:
        code = item.get("code")
        close = item.get("adjusted_close") or item.get("close")
        if code and close is not None:
            prices[code] = close

    log.info(f"종가 수집: {len(prices)}개 티커")
    return prices


# ── 유틸리티 ────────────────────────────────────────────
def save_gzip_json(data, filepath: Path):
    """JSON → gzip 압축 저장"""
    json_bytes = json.dumps(data, ensure_ascii=False, separators=(",", ":")).encode(
        "utf-8"
    )

    with gzip.open(filepath, "wb") as f:
        f.write(json_bytes)

    original_mb = len(json_bytes) / 1024 / 1024
    compressed_mb = filepath.stat().st_size / 1024 / 1024
    ratio = (1 - compressed_mb / original_mb) * 100 if original_mb > 0 else 0
    log.info(
        f"저장: {filepath.name} "
        f"({original_mb:.1f}MB → {compressed_mb:.1f}MB, -{ratio:.0f}%)"
    )


def upload_to_s3(filepath: Path, s3_key: str):
    """S3에 gzip 파일 업로드"""
    s3 = boto3.client(
        "s3",
        aws_access_key_id=AWS_ACCESS_KEY,
        aws_secret_access_key=AWS_SECRET_KEY,
        region_name=AWS_REGION,
    )

    s3.upload_file(
        str(filepath),
        S3_BUCKET,
        s3_key,
        ExtraArgs={
            "ContentType": "application/json",
            "ContentEncoding": "gzip",
        },
    )
    log.info(f"S3 업로드: s3://{S3_BUCKET}/{s3_key}")


# ── Main ────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Stock Info Daily Data Collector")
    parser.add_argument("--local", action="store_true", help="로컬 저장만, S3 업로드 스킵")
    parser.add_argument("--tickers-only", action="store_true", help="티커 목록만 수집")
    parser.add_argument("--limit", type=int, default=0, help="테스트용: 펀더멘탈 수집 티커 수 제한")
    args = parser.parse_args()

    # 설정 검증
    if not EODHD_API_KEY:
        log.error("EODHD_API_KEY가 .env에 없음")
        sys.exit(1)
    if not args.local and not all([S3_BUCKET, AWS_ACCESS_KEY, AWS_SECRET_KEY]):
        log.error("S3 설정 누락 (.env 확인 또는 --local 사용)")
        sys.exit(1)

    today = datetime.now().strftime("%Y-%m-%d")
    log.info(f"=== Stock Info 데이터 수집 시작: {today} ===")

    # [1/3] 티커 목록
    log.info("[1/3] 티커 목록 수집...")
    tickers = fetch_ticker_list()
    save_gzip_json(tickers, OUTPUT_DIR / "tickers.json.gz")

    if args.tickers_only:
        log.info("--tickers-only 모드, 완료.")
        return

    # [2/3] 펀더멘탈
    target_tickers = tickers
    if args.limit > 0:
        target_tickers = tickers[: args.limit]
        log.info(f"--limit {args.limit}: {len(target_tickers)}개만 수집")

    log.info(f"[2/3] 펀더멘탈 수집... ({len(target_tickers)}개)")
    fundamentals = fetch_fundamentals(target_tickers)
    save_gzip_json(fundamentals, OUTPUT_DIR / "fundamentals.json.gz")

    # [3/3] 종가 (Bulk API - 한 번 호출)
    log.info("[3/3] 종가 수집 (Bulk API)...")
    closes = fetch_close_prices()
    save_gzip_json(closes, OUTPUT_DIR / "close-prices.json.gz")

    # S3 업로드
    if not args.local:
        log.info("S3 업로드 시작...")
        files = [
            ("tickers.json.gz", f"data/{today}/tickers.json.gz"),
            ("fundamentals.json.gz", f"data/{today}/fundamentals.json.gz"),
            ("close-prices.json.gz", f"data/{today}/close-prices.json.gz"),
        ]
        for filename, dated_key in files:
            filepath = OUTPUT_DIR / filename
            if not filepath.exists():
                continue
            # 날짜별 아카이브
            upload_to_s3(filepath, dated_key)
            # latest (프론트엔드가 fetch할 경로)
            upload_to_s3(filepath, f"data/latest/{filename}")

    log.info(f"=== 수집 완료: {today} ===")


if __name__ == "__main__":
    main()
