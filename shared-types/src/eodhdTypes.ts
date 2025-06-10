export type EODHDTradeMessage = {
  s: string; // ticker code (예: "AAPL")
  p: number; // trade price
  c: string; // trade conditions (ex: "@" or "F")
  v: number; // volume (주식 수량)
  dp: boolean; // dark pool 여부
  ms: "open" | "closed" | "extended hours"; // market status
  t: number; // timestamp (milliseconds)
};
