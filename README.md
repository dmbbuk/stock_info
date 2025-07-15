# stock_info

주식의 정보를 한 페이지에 표시해주는 웹 어플리케이션

design
shadcn/ui

TODO

1. 메뉴쪽 다국어화 설정 i18n 사용?
2. 모든 주식의 정보를 가져오기
3. 웹소켓을 사용해서 접속한채로 실시간 데이터를 받아올 수 있음, 하지만 모든 데이터를 한번에 가져오려면 어떻게 해야할까? 우선순위에 따라서 나누어야 할까? 설계 고민...
4.

[사용자 브라우저]
│
▼
React (localhost:3000) ────▶ WebSocket (EC2:3001)
│ ▲
▼ │
Next.js API Routes (Vercel or Lambda) ◀── REST (펀더멘털, 감시리스트)

[Frontend (React SPA)]
↕ socket.io (실시간)
↕ REST (지표조회)

[Next.js API 서버]
↕ REST API (지표 Fetch)
⟳ 주기적 백그라운드 fetch & 캐싱 (예: Redis, DB)
↕ EODHD (REST API 사용, 하루 1회)

[WebSocket 중계 서버]
↕ socket.io
↔ EODHD WebSocket (실시간 가격)

4. 디자인
   ✨ 차선 제안 (더 미니멀하게)
   기본은 테이블만 제공

“내 종목 요약 보기”는 카드 UI로 제공하되, Top 3~5 종목만 요약 (예: 홈 위젯처럼)

카드 뷰는 “추후 확장 기능”으로 자연스럽게 추가

## 📊 FundamentalData 필드 설명

| No. | 필드명                       | 타입      | 설명                        | EODHD JSON 경로                                                           |
| --- | ---------------------------- | --------- | --------------------------- | ------------------------------------------------------------------------- |
| 1   | `sector`                     | `string`  | 산업 섹터                   | `General.Sector`                                                          |
| 2   | `PER`                        | `number`  | 주가수익비율 (PER)          | `Highlights.PERatio` or `Valuation.TrailingPE`                            |
| 3   | `EPS`                        | `number`  | 주당순이익 (EPS)            | `Highlights.EarningsShare`                                                |
| 4   | `PBR`                        | `number`  | 주가순자산비율 (PBR)        | `Valuation.PriceBookMRQ`                                                  |
| 5   | `dividendYield`              | `number`  | 배당수익률 (%)              | `Highlights.DividendYield`                                                |
| 6   | `PEG`                        | `number?` | 주가수익성장비율            | `Highlights.PEGRatio`                                                     |
| 7   | `payoutRatio`                | `number?` | 배당성향 (%)                | `SplitsDividends.PayoutRatio`                                             |
| 8   | `roe`                        | `number?` | 자기자본이익률 (ROE)        | `Highlights.ReturnOnEquityTTM`                                            |
| 9   | `epsGrowth`                  | `number?` | EPS 증가율 (연간)           | `Highlights.QuarterlyEarningsGrowthYOY` _(근사치)_                        |
| 10  | `revenueGrowth`              | `number?` | 매출 증가율 (연간)          | `Highlights.QuarterlyRevenueGrowthYOY` _(근사치)_                         |
| 11  | `evEbitda`                   | `number?` | EV/EBITDA                   | `Valuation.EnterpriseValueEbitda`                                         |
| 12  | `operatingMargin`            | `number?` | 영업이익률 (%)              | `Highlights.OperatingMarginTTM`                                           |
| 13  | `profitMargin`               | `number?` | 순이익률 (%)                | `Highlights.ProfitMargin`                                                 |
| 14  | `evEbit`                     | `number?` | EV/EBIT                     | ❗ 직접 계산 필요 (EV / EBIT)                                             |
| 15  | `EBITDA`                     | `number?` | 상각 전 영업이익            | `Highlights.EBITDA`                                                       |
| 16  | `WallStreetTargetPrice`      | `number?` | 애널리스트 평균 목표 주가   | `Highlights.WallStreetTargetPrice`                                        |
| 17  | `BookValue`                  | `number?` | 주당 순자산 가치            | `Highlights.BookValue`                                                    |
| 18  | `DividendShare`              | `number?` | 주당 배당금                 | `Highlights.DividendShare` or `SplitsDividends.ForwardAnnualDividendRate` |
| 19  | `EPSEstimateCurrentYear`     | `number?` | 올해 EPS 예상치             | `Highlights.EPSEstimateCurrentYear`                                       |
| 20  | `EPSEstimateNextYear`        | `number?` | 내년 EPS 예상치             | `Highlights.EPSEstimateNextYear`                                          |
| 21  | `EPSEstimateNextQuarter`     | `number?` | 다음 분기 EPS 예상치        | `Highlights.EPSEstimateNextQuarter`                                       |
| 22  | `EPSEstimateCurrentQuarter`  | `number?` | 이번 분기 EPS 예상치        | `Highlights.EPSEstimateCurrentQuarter`                                    |
| 23  | `MostRecentQuarter`          | `string`  | 최근 분기 날짜 (YYYY-MM-DD) | `Highlights.MostRecentQuarter`                                            |
| 24  | `ReturnOnAssetsTTM`          | `number?` | 총자산이익률 (ROA)          | `Highlights.ReturnOnAssetsTTM`                                            |
| 25  | `RevenueTTM`                 | `number?` | 최근 12개월 총매출          | `Highlights.RevenueTTM`                                                   |
| 26  | `RevenuePerShareTTM`         | `number?` | 주당 매출액                 | `Highlights.RevenuePerShareTTM`                                           |
| 27  | `QuarterlyRevenueGrowthYOY`  | `number?` | 전년동기 대비 매출 성장률   | `Highlights.QuarterlyRevenueGrowthYOY`                                    |
| 28  | `GrossProfitTTM`             | `number?` | 매출총이익                  | `Highlights.GrossProfitTTM`                                               |
| 29  | `QuarterlyEarningsGrowthYOY` | `number?` | 전년동기 대비 EPS 성장률    | `Highlights.QuarterlyEarningsGrowthYOY`                                   |
| 30  | `marketCap`                  | `string`  | 시가총액                    | `Highlights.MarketCapitalization`                                         |
| 31  | `volume`                     | `string`  | 일일 거래량                 | `Technicals.Volume`                                                       |
| 32  | `name`                       | `string`  | 회사명                      | `General.Name`                                                            |
