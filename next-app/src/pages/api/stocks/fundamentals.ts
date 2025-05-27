// src/pages/api/stocks/fundamentals.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { symbol } = req.query;

  if (!symbol || typeof symbol !== "string") {
    return res.status(400).json({ error: "symbol is required" });
  }

  const apiKey = process.env.FINNHUB_API_KEY;
  const url = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data.metric);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch fundamentals" });
  }
}
