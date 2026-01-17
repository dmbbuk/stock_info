// src/components/service/dailyPriceFetcher.ts
// import { chunk } from "lodash";

export async function fetchDailyClosePriceFor(symbols: string[]) {
  // URL 길이 제한 방지를 위한 배치 처리 (예: 50개씩)
  const BATCH_SIZE = 50;
  const symbolChunks = [];

  for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
    symbolChunks.push(symbols.slice(i, i + BATCH_SIZE));
  }

  const results: Record<string, number> = {};

  // 병렬 요청
  const promises = symbolChunks.map(async (chunkSymbols) => {
    try {
      const query = chunkSymbols.join(",");
      const res = await fetch(
        `http://localhost:3000/api/stocks/close-prices?symbols=${query}`
      );
      if (!res.ok) return {};
      const data = await res.json();
      return data.closes;
    } catch (e) {
      console.error("Failed to fetch prices for batch", e);
      return {};
    }
  });

  const responses = await Promise.all(promises);

  responses.forEach((batchResult) => {
    Object.assign(results, batchResult || {});
  });

  return results;
}
