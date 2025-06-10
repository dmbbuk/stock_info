export const mockFundamentals: Record<
  string,
  {
    peRatio: number;
    pbRatio: number;
    eps: number;
    dividendYield: number;
    marketCap: number;
  }
> = {
  AAPL: {
    peRatio: 28.3,
    pbRatio: 39.2,
    eps: 6.11,
    dividendYield: 0.52,
    marketCap: 2750000000000,
  },
  MSFT: {
    peRatio: 32.1,
    pbRatio: 14.5,
    eps: 8.3,
    dividendYield: 0.75,
    marketCap: 2600000000000,
  },
  BBBB: {
    peRatio: 33.1,
    pbRatio: 14.5,
    eps: 8.3,
    dividendYield: 0.75,
    marketCap: 2600000000000,
  },
  META: {
    peRatio: 31.1,
    pbRatio: 15.5,
    eps: 8.4,
    dividendYield: 0.11,
    marketCap: 2000000000000,
  },
};
