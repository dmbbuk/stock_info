import { Fundamentals } from "../../types/fundamentals";

export const fetchFundamentalsFor = async (
  tickers: string[]
): Promise<Record<string, Fundamentals>> => {
  const result: Record<string, Fundamentals> = {};

  for (const ticker of tickers) {
    try {
      const res = await fetch(
        `http://localhost:3000/api/stocks/fundamentals?symbol=${ticker}`
      );
      const data = await res.json();

      if (data && Object.keys(data).length > 0) {
        result[ticker] = {
          ticker: ticker,
          PER: data.peRatio ?? 0,
          EPS: data.eps ?? 0,
          marketCap: data.marketCap ?? 0,
          PBR: data.pbRatio ?? 0,
          dividendYield: data.dividendYield ?? 0,
        };
      }
    } catch (e) {
      console.error(`펀더멘털 요청 실패: ${ticker}`, e);
    }
  }

  return result;
};
