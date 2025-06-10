// src/types/fundamentals.ts

// 가격을 포함하지 않는 지수
export type Fundamentals = {
  ticker: string;
  PER: number;
  PBR: number;
  EPS: number;
  marketCap: number;
  dividendYield: number;
};
