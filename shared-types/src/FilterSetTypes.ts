// \stock_info\shared-types\src\filterSetTypes.ts

export type FilterSetTypes = {
  PER: string;
  EPS: string;
  PBR: string;
  dividendYield: string;
  PEG: string;
  payoutRatio: string;
  roe: string;
  epsGrowth: string;
  revenueGrowth: string;
  evEbitda: string;
  operatingMargin: string;
  profitMargin: string;
  evEbit: string;
  EBITDA: string;
  WallStreetTargetPrice: string;
  BookValue: string;
  DividendShare: string;
  EPSEstimateCurrentYear: string;
  EPSEstimateNextYear: string;
  EPSEstimateNextQuarter: string;
  EPSEstimateCurrentQuarter: string;
  ReturnOnAssetsTTM: string;
  RevenueTTM: string;
  RevenuePerShareTTM: string;
  QuarterlyRevenueGrowthYOY: string;
  GrossProfitTTM: string;
  QuarterlyEarningsGrowthYOY: string;
  marketCap: string;
  volume: string;
  sector?: string; // (선택)
};

// 공용 타입 추출!
export type FilterKey = keyof FilterSetTypes;
export type Filters = Partial<FilterSetTypes>;
