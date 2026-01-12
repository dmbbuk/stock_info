// \stock_info\shared-types\src\fundamentalTypes.ts

export type FundamentalData = {
  sector: string;
  // 1. 산업 섹터 (예: Technology, Healthcare 등)
  // General.Sector

  PER: number;
  // 2. 주가수익비율 (PER)
  // Highlights.PERatio 또는 Valuation.TrailingPE

  EPS: number;
  // 3. 주당순이익 (EPS)
  // Highlights.EarningsShare

  PBR: number;
  // 4. 주가순자산비율 (PBR)
  // Valuation.PriceBookMRQ

  dividendYield: number;
  // 5. 배당수익률 (%)
  // Highlights.DividendYield

  PEG?: number;
  // 6. 주가수익성장비율 (PEG)
  // Highlights.PEGRatio

  payoutRatio?: number;
  // 7. 배당성향 (%)
  // SplitsDividends.PayoutRatio

  roe?: number;
  // 8. 자기자본이익률 (ROE)
  // Highlights.ReturnOnEquityTTM

  epsGrowth?: number;
  // 9. EPS 증가율 (연간)
  // Highlights.QuarterlyEarningsGrowthYOY (근사치)

  revenueGrowth?: number;
  // 10. 매출 증가율 (연간)
  // Highlights.QuarterlyRevenueGrowthYOY (근사치)

  evEbitda?: number;
  // 11. EV/EBITDA
  // Valuation.EnterpriseValueEbitda

  operatingMargin?: number;
  // 12. 영업이익률 (%)
  // Highlights.OperatingMarginTTM

  profitMargin?: number;
  // 13. 순이익률 (%)
  // Highlights.ProfitMargin

  evEbit?: number;
  // 14. EV/EBIT
  // 직접 계산 필요 (EnterpriseValue / EBIT)

  EBITDA?: number;
  // 15. 상각 전 영업이익 (USD)
  // Highlights.EBITDA

  WallStreetTargetPrice?: number;
  // 16. 애널리스트 평균 목표 주가
  // Highlights.WallStreetTargetPrice

  BookValue?: number;
  // 17. 주당 순자산 가치
  // Highlights.BookValue

  DividendShare?: number;
  // 18. 주당 배당금
  // Highlights.DividendShare 또는 SplitsDividends.ForwardAnnualDividendRate

  EPSEstimateCurrentYear?: number;
  // 19. 올해 EPS 예상치
  // Highlights.EPSEstimateCurrentYear

  EPSEstimateNextYear?: number;
  // 20. 내년 EPS 예상치
  // Highlights.EPSEstimateNextYear

  EPSEstimateNextQuarter?: number;
  // 21. 다음 분기 EPS 예상치
  // Highlights.EPSEstimateNextQuarter

  EPSEstimateCurrentQuarter?: number;
  // 22. 이번 분기 EPS 예상치
  // Highlights.EPSEstimateCurrentQuarter

  MostRecentQuarter?: string;
  // 23. 최근 분기 기준일 (YYYY-MM-DD)
  // Highlights.MostRecentQuarter

  ReturnOnAssetsTTM?: number;
  // 24. 총자산이익률 (ROA)
  // Highlights.ReturnOnAssetsTTM

  RevenueTTM?: number;
  // 25. 최근 12개월 총매출
  // Highlights.RevenueTTM

  RevenuePerShareTTM?: number;
  // 26. 주당 매출액
  // Highlights.RevenuePerShareTTM

  QuarterlyRevenueGrowthYOY?: number;
  // 27. 전년동기 대비 매출 성장률
  // Highlights.QuarterlyRevenueGrowthYOY

  GrossProfitTTM?: number;
  // 28. 매출총이익
  // Highlights.GrossProfitTTM

  QuarterlyEarningsGrowthYOY?: number;
  // 29. 전년동기 대비 EPS 성장률
  // Highlights.QuarterlyEarningsGrowthYOY

  marketCap: string;
  // 30. 시가총액
  // Highlights.MarketCapitalization

  volume: string;
  // 31. 일일 거래량
  // Technicals.Volume

  name: string;
  // 32. 회사 이름
  // General.Name

  // --- Magic Formula용 데이터 (EODHD 매핑) ---
  ebit?: number;
  // Financials.Income_Statement.EBIT

  enterpriseValue?: number;
  // Valuation.EnterpriseValue

  netWorkingCapital?: number;
  // Balance_Sheet.TotalCurrentAssets - TotalCurrentLiabilities

  netFixedAssets?: number;
  // Balance_Sheet.PropertyPlantAndEquipmentNet

  // --- Magic Formula 계산된 지표 ---
  earningsYield?: number;
  // EBIT / EnterpriseValue

  returnOnCapital?: number;
  // EBIT / (NetWorkingCapital + NetFixedAssets)
};
