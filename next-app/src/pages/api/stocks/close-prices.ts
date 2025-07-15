// pages/api/stocks/close-prices.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { handleCors } from "../../../lib/cors";

const apiKey = process.env.EODHD_API_KEY!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (handleCors(req, res)) return;
  const { symbols } = req.query;

  if (!symbols || typeof symbols !== "string") {
    return res.status(400).json({ error: "symbols query parameter required" });
  }

  // .env에 따라 mock 모드 전환
  const isMockMode = process.env.USE_MOCK_FUNDAMENTALS === "true";

  const symbolList = symbols.split(",");
  const result: Record<string, number | null> = {};

  if (isMockMode) {
    symbolList.forEach((symbol) => {
      // 100 ~ 500 사이 랜덤 종가 생성
      const mockClose = parseFloat((Math.random() * 400 + 100).toFixed(2));
      result[symbol] = mockClose;
    });
  } else {
    const responses = await Promise.all(
      symbolList.map(async (symbol) => {
        try {
          const url = `https://eodhd.com/api/eod/${symbol}.US?api_token=${apiKey}&fmt=json&limit=1`;
          const response = await fetch(url);
          const data = await response.json();
          return { symbol, close: data?.[0]?.adjusted_close ?? null };
        } catch {
          return { symbol, close: null };
        }
      })
    );

    responses.forEach(({ symbol, close }) => {
      result[symbol] = close;
    });
  }

  res.status(200).json({ closes: result });
}
