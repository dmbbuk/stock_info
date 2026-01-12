import type { NextApiRequest, NextApiResponse } from "next";
import { handleCors } from "../../../lib/cors";
import fundamentalMockArray from "../../../mocks/data/mock_eodhd_fundamentals_10000.json";
import type { FundamentalData } from "shared-types/src/fundamentalTypes";

// ---- [1] 모듈 scope에서 최초 1회만 변환 (캐싱) ----
const fundamentalMockMap: Record<string, FundamentalData> = {};
for (const item of fundamentalMockArray as any[]) {
  // --- Magic Formula용 파생 데이터 계산 (데모용 추정치) ---
  const revenue = item.Highlights?.RevenueTTM ?? 0;
  const opMargin = item.Highlights?.OperatingMarginTTM ?? 0;
  const computedEbit = revenue * opMargin; // EBIT ≈ Revenue * OperatingMargin

  const ebitda = item.Highlights?.EBITDA ?? 0;
  const evEbitdaRatio = item.Valuation?.EnterpriseValueEbitda ?? 0;
  // EV ≈ EBITDA * (EV/EBITDA)
  const computedEV =
    ebitda && evEbitdaRatio
      ? ebitda * evEbitdaRatio
      : item.Highlights?.MarketCapitalization ?? 0;

  // 투하자본 구성요소 (데이터 부재로 시가총액 기반 추정)
  const marketCapVal = item.Highlights?.MarketCapitalization ?? 0;
  const computedNWC = marketCapVal * 0.15; // Net Working Capital 추정
  const computedNFA = marketCapVal * 0.25; // Net Fixed Assets 추정

  const enterpriseValueParam = item.Valuation?.EnterpriseValueEbitda;
  const evEbit =
    enterpriseValueParam && ebitda && ebitda !== 0
      ? enterpriseValueParam / ebitda
      : undefined;

  // Magic Formula Metrics (Pre-calculated for Filtering)
  const earningsYield =
    computedEbit && computedEV && computedEV !== 0
      ? computedEbit / computedEV
      : undefined;

  const investedCapital = computedNWC + computedNFA;
  const returnOnCapital =
    computedEbit && investedCapital && investedCapital !== 0
      ? computedEbit / investedCapital
      : undefined;

  fundamentalMockMap[item.General.Code] = {
    sector: item.General?.Sector ?? "",
    PER: item.Highlights?.PERatio ?? 0,
    EPS: item.Highlights?.EarningsShare ?? 0,
    PBR: item.Valuation?.PriceBookMRQ ?? 0,
    dividendYield: item.Highlights?.DividendYield ?? 0,
    PEG: item.Highlights?.PEGRatio ?? undefined,
    payoutRatio: item.SplitsDividends?.PayoutRatio ?? undefined,
    roe: item.Highlights?.ReturnOnEquityTTM ?? undefined,
    epsGrowth: item.Highlights?.QuarterlyEarningsGrowthYOY ?? undefined,
    revenueGrowth: item.Highlights?.QuarterlyRevenueGrowthYOY ?? undefined,
    evEbitda: item.Valuation?.EnterpriseValueEbitda ?? undefined,
    operatingMargin: item.Highlights?.OperatingMarginTTM ?? undefined,
    profitMargin: item.Highlights?.ProfitMargin ?? undefined,
    evEbit,
    EBITDA: item.Highlights?.EBITDA ?? undefined,
    WallStreetTargetPrice: item.Highlights?.WallStreetTargetPrice ?? undefined,
    BookValue: item.Highlights?.BookValue ?? undefined,
    DividendShare: item.Highlights?.DividendShare ?? undefined,
    EPSEstimateCurrentYear:
      item.Highlights?.EPSEstimateCurrentYear ?? undefined,
    EPSEstimateNextYear: item.Highlights?.EPSEstimateNextYear ?? undefined,
    EPSEstimateNextQuarter:
      item.Highlights?.EPSEstimateNextQuarter ?? undefined,
    EPSEstimateCurrentQuarter:
      item.Highlights?.EPSEstimateCurrentQuarter ?? undefined,
    MostRecentQuarter: item.Highlights?.MostRecentQuarter ?? "",
    ReturnOnAssetsTTM: item.Highlights?.ReturnOnAssetsTTM ?? undefined,
    RevenueTTM: item.Highlights?.RevenueTTM ?? undefined,
    RevenuePerShareTTM: item.Highlights?.RevenuePerShareTTM ?? undefined,
    QuarterlyRevenueGrowthYOY:
      item.Highlights?.QuarterlyRevenueGrowthYOY ?? undefined,
    GrossProfitTTM: item.Highlights?.GrossProfitTTM ?? undefined,
    QuarterlyEarningsGrowthYOY:
      item.Highlights?.QuarterlyEarningsGrowthYOY ?? undefined,
    marketCap: String(item.Highlights?.MarketCapitalization ?? "0"),
    volume: String(item.Technicals?.Volume ?? "0"),
    name: String(item.General?.Name ?? undefined),

    // Magic Formula Fields
    ebit: computedEbit,
    enterpriseValue: computedEV,
    netWorkingCapital: computedNWC,
    netFixedAssets: computedNFA,
    earningsYield,
    returnOnCapital,
  };
}

// ---- [2] 핸들러에서는 캐싱된 객체만 반환 ----
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (handleCors(req, res)) return;

  const isMockMode = process.env.USE_MOCK_FUNDAMENTALS === "true";

  if (isMockMode) {
    // 변환된 객체 반환
    return res.status(200).json(fundamentalMockMap);
  }

  // (실서비스: 예시)
  // const response = await fetch("https://s3-url/전체fundamentals.json");
  // const data = await response.json();
  // return res.status(200).json(data);

  return res.status(501).json({ error: "실서비스 전체 데이터는 미구현" });
}
