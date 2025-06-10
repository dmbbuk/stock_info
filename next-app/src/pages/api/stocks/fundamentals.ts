// src/pages/api/stocks/fundamentals.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { symbol } = req.query;

  if (!symbol || typeof symbol !== "string") {
    return res.status(400).json({ error: "symbol is required" });
  }

  const apiKey = process.env.EODHD_API_KEY;
  const url = `https://eodhd.com/api/fundamentals/${symbol}.US?api_token=${apiKey}`;

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

    // 필요한 항목만 골라서 반환 (기존 프론트 호환 위해)
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
