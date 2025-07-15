import type { FundamentalData } from "shared-types/src/fundamentalTypes";

/**
 * 전체 fundamentals를 한 번에 받아 필요한 ticker만 반환
 * @param tickers 원하는 티커 배열
 */
export const fetchFundamentalsFor = async (): Promise<
  Record<string, FundamentalData>
> => {
  // 전체 데이터 fetch (symbol 파라미터 없음!)
  const res = await fetch("http://localhost:3000/api/stocks/fundamentals");
  if (!res.ok) {
    // 에러 핸들링
    const text = await res.text();
    throw new Error(`API Error: ${res.status}, body: ${text}`);
  }
  const allData: Record<string, FundamentalData> = await res.json();

  return allData;
};
