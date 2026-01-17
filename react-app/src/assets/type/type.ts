export type FinnhubTrade = {
    s: string; // Symbol (티커)
    p: number; // Price (가격)
    t: number; // Timestamp (밀리초)
    v: number; // Volume (거래량)
  };
  
export type FinnhubMessage = {
    type: 'trade';
    data: FinnhubTrade[];
  };
  
export type StockRow = {
    ticker: string;
    name: string;
    price: string;
    marketCap: string;
    volume: string;
    PER: string;
    EPS?: string;
    PBR?: string;
    dividendYield?: string;
    summary: string;
    magicRank?: number; // 마법공식 순위
    earningsYield?: number;
    returnOnCapital?: number;
};