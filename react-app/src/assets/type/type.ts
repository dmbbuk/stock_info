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
    price: number | string;   // 숫자로 관리하는 게 좋음
    marketCap: number | string;
    volume: number | string;
    PER: number | string;
    EPS?: number | string;
    PBR?: number | string;
    dividendYield?: number | string;
    summary: string;
    magicRank?: number; 
    earningsYield?: number;
    returnOnCapital?: number;

    // Technicals
    Week52High?: number;
    Week52Low?: number;
    Day50MA?: number;
    Day200MA?: number;
};