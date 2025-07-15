import type { NextApiRequest, NextApiResponse } from "next";
import { handleCors } from "../../../lib/cors";
import fundamentalMockArray from "../../../mocks/data/mock_eodhd_fundamentals_200.json";
import type { FundamentalData } from "shared-types/src/fundamentalTypes";

// ---- [1] 모듈 scope에서 최초 1회만 변환 (캐싱) ----
const fundamentalMockMap: Record<string, FundamentalData> = {};
for (const item of fundamentalMockArray) {
  // evEbit 계산
  const enterpriseValue = item.Valuation?.EnterpriseValueEbitda;
  const ebit = item.Highlights?.EBITDA;
  const evEbit =
    enterpriseValue && ebit && ebit !== 0 ? enterpriseValue / ebit : undefined;

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
