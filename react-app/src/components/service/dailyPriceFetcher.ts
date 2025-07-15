// src/components/service/dailyPriceFetcher.ts
export async function fetchDailyClosePriceFor(symbols: string[]) {
  const query = symbols.join(",");
  const res = await fetch(
    `http://localhost:3000/api/stocks/close-prices?symbols=${query}`
  );
  const data = await res.json();
  return data.closes as Record<string, number>;
}
