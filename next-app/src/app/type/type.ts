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