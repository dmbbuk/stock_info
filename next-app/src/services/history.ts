// import { fetchEODHistorical } from "@/utils/eodhd"; // EODHD에서 날짜별 종가 불러오기

// export async function getHistoricalClosePrices(
//   tickers: string[]
// ): Promise<Record<string, number>> {
//   const result: Record<string, number> = {};

//   for (const symbol of tickers) {
//     const history = await fetchEODHistorical(symbol); // EODHD: /eod/{symbol}.US?from=...&to=...

//     const previousClose = history?.[1]?.close; // 하루 전 종가 (ex: 어제)
//     if (previousClose) result[symbol] = previousClose;
//   }

//   return result;
// }
