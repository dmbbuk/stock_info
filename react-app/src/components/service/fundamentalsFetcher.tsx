// src/services/fundamentalsFetcher.ts
export type Fundamentals = {
  t: string;
  per: number;
  eps: number;
  marketCap: number;
  pbr: number;
  dividendYield: number;
};

export const isStockTicker = (symbol: string) => !symbol.startsWith("BINANCE:");

export const fetchFundamentalsFor = async (
  tickers: string[]
): Promise<Record<string, Fundamentals>> => {
  const result: Record<string, Fundamentals> = {};
  const stockTickers = tickers.filter(isStockTicker);
  console.log("aaa");

  for (const ticker of stockTickers) {
    try {
      const res = await fetch(
        `http://localhost:3001/api/stocks/fundamentals?symbol=${ticker}`
      );
      const data = await res.json();

      if (data && Object.keys(data).length > 0) {
        result[ticker] = {
          t: ticker,
          per: data.peTTM,
          eps: data.epsTTM,
          marketCap: data.marketCapitalization,
          pbr: data.pb,
          dividendYield: data.currentDividendYieldTTM,
        };
      }
    } catch (e) {
      console.error(`펀더멘털 요청 실패: ${ticker}`, e);
    }
  }

  return result;
};
