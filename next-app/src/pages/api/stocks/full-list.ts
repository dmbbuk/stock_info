// /pages/api/stocks/full-list.ts

import { NextApiRequest, NextApiResponse } from "next";
import { handleCors } from "../../../lib/cors";
// import { getS3Json } from "../../utils/getS3Json"; // S3에서 파일 가져오는 유틸

// Mock 관련
import mockSymbols from "@/mocks/mock_symbols.json";
import mockFundamentals from "../../../mocks/data/mock_eodhd_fundamentals_200.json";
import mockPrices from "@/mocks/mock_prices.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const useMock = process.env.USE_MOCK_DATA === "true";

  let symbols: any, fundamentals: any, prices: any;

  if (useMock) {
    // 1. 로컬 mock 데이터 사용
    symbols = mockSymbols;
    fundamentals = mockFundamentals;
    prices = mockPrices;
  } else {
    // 2. S3에서 fetch
    // [symbols, fundamentals, prices] = await Promise.all([
    //   getS3Json("symbols.json"),
    //   getS3Json("fundamentals_20240701.json"),
    //   getS3Json("prices_20240701.json"),
    // ]);
  }

  // 3. 병합(티커 기준)
  const merged = symbols.map((item: any) => {
    const ticker = item.Code;
    return {
      ...item,
      ...(fundamentals[ticker] || {}),
      ...(prices[ticker] || {}),
    };
  });

  res.status(200).json({ stocks: merged });
}
