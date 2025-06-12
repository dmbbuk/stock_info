// pages/api/stocks/hot-tickers.ts
import type { NextApiRequest, NextApiResponse } from "next";
import mockHotTickers100 from "@/mocks/data/mockHotTickers_100.json";
import type { Fundamentals } from "shared-types/src/fundamentals";
import { handleCors } from "../../../lib/cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (handleCors(req, res)) return;

  const isMock = process.env.USE_MOCK_HOT_TICKERS === "true";

  if (isMock) {
    const tickers = mockHotTickers100.map((item) => item.code);
    const fundamentals: Record<string, Fundamentals> = {};

    mockHotTickers100.forEach((item) => {
      fundamentals[item.code] = {
        PER: item.pe,
        PBR: item.pb,
        EPS: item.eps,
        marketCap: item.market_capitalization,
        dividendYield: item.dividend_yield,
        volume: item.volume,
      };
    });

    return res.status(200).json({ tickers, fundamentals });
  }

  // 실제 API 호출
  const response = await fetch("https://real.api/hot-tickers");
  const json = await response.json();
  const tickers = json.map((item: any) => item.code);
  const fundamentals: Record<string, Fundamentals> = {}; // 비워두고 클라이언트가 fetchFundamentalsFor 사용

  return res.status(200).json({ tickers, fundamentals });
}
