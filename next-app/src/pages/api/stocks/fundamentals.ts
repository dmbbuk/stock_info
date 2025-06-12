// src/pages/api/stocks/fundamentals.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { handleCors } from "../../../lib/cors";
import { mockFundamentals } from "../../../mocks/mockFundamentalData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (handleCors(req, res)) return;

  const { symbol } = req.query;

  if (!symbol || typeof symbol !== "string") {
    return res.status(400).json({ error: "symbol is required" });
  }

  // .env에 따라 mock 모드 전환
  const isMockMode = process.env.USE_MOCK_FUNDAMENTALS === "true";

  if (isMockMode) {
    const mockData = mockFundamentals[symbol];
    if (mockData) {
      return res.status(200).json(mockData);
    } else {
      return res.status(404).json({ error: "No mock data found" });
    }
  }

  const apiKey = process.env.EODHD_API_KEY;
  const url = `https://eodhd.com/api/fundamentals/${symbol}.US?api_token=${apiKey}&fmt=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res
        .status(502)
        .json({ error: "EODHD fetch failed", status: response.status });
    }

    const data = await response.json();
    if (!data || !data.Highlights) {
      return res
        .status(404)
        .json({ error: "No fundamental data returned from EODHD" });
    }

    const formatted = {
      peRatio: data.Highlights.PERatioTTM,
      pbRatio: data.Highlights.PriceBookMRQ,
      eps: data.Highlights.EPSTTM,
      dividendYield: data.Highlights.DividendYield,
      marketCap: data.Highlights.MarketCapitalization,
    };

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch fundamentals" });
  }
}
