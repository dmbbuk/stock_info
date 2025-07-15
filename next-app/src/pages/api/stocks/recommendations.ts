// // pages/api/stocks/recommendations.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import { getFundamentalsForTickers } from "@/services/fundamentals"; // EODHD로부터 metric 가져오는 함수
// import { getHistoricalClosePrices } from "@/services/history"; // 종가 가져오는 함수 (예: 전일 종가)
// import { hotTickers } from "@/constants/hotTickers"; // 기준 티커들

// type SurgingItem = {
//   symbol: string;
//   name?: string;
//   changeRate: number;
//   price: number;
//   previousClose: number;
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { group } = req.query;

//   if (group !== "surging") {
//     return res.status(400).json({ message: "지원하지 않는 group입니다." });
//   }

//   try {
//     const tickers = hotTickers; // 또는 EODHD Screener 결과

//     // 현재 가격은 fundamentals(metric.price) 사용
//     const fundamentals = await getFundamentalsForTickers(tickers);

//     // 전일 종가 불러오기
//     const previousCloses = await getHistoricalClosePrices(tickers); // { AAPL: 191.23, TSLA: 178.3, ... }

//     const result: SurgingItem[] = tickers
//       .map((symbol) => {
//         const currentPrice = fundamentals[symbol]?.price;
//         const previousClose = previousCloses[symbol];

//         if (!currentPrice || !previousClose) return null;

//         const changeRate =
//           ((currentPrice - previousClose) / previousClose) * 100;

//         return {
//           symbol,
//           price: currentPrice,
//           previousClose,
//           changeRate,
//         };
//       })
//       .filter((item): item is SurgingItem => item !== null)
//       .sort((a, b) => b.changeRate - a.changeRate)
//       .slice(0, 100);

//     return res
//       .status(200)
//       .json({ tickers: result.map((r) => r.symbol), fundamentals });
//   } catch (err) {
//     console.error("급등주 추천 오류:", err);
//     return res.status(500).json({ message: "서버 오류" });
//   }
// }
