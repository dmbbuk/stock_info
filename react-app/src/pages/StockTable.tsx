import { hotTickers } from "../constants/hotTickers";
import { useStockSocket } from "../hooks/useStockSocket";
import { fetchFundamentalsFor } from "../components/service/fundamentalsFetcher";
import { useEffect, useState } from "react";
import { formatTime } from "../utils/formatTime";
import type { RealtimePrice } from "../types/realtime";
import { Fundamentals } from "../types/fundamentals";

const StockTable = () => {
  const { latestPrices, subscribeTickers } = useStockSocket(hotTickers);
  const [fundamentals, setFundamentals] = useState<
    Record<string, Fundamentals>
  >({});

  useEffect(() => {
    // 실시간 가격 구독
    subscribeTickers(hotTickers);

    // 펀더멘털 fetch
    const loadFundamentals = async () => {
      const data = await fetchFundamentalsFor(hotTickers);
      setFundamentals(data);
    };
    loadFundamentals();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Ticker</th>
          <th>Price</th>
          <th>Time</th>
          <th>PER</th>
          <th>PBR</th>
          <th>EPS</th>
          <th>시가총액</th>
          <th>배당수익률</th>
        </tr>
      </thead>
      <tbody>
        {hotTickers.map((ticker) => {
          const priceData: RealtimePrice | undefined = latestPrices[ticker];
          const f = fundamentals[ticker];
          return (
            <tr key={ticker}>
              <td>{ticker}</td>
              <td>{priceData?.price ?? "-"}</td>
              <td>{formatTime(priceData?.timestamp)}</td>
              <td>{f?.PER ?? "-"}</td>
              <td>{f?.PBR ?? "-"}</td>
              <td>{f?.EPS ?? "-"}</td>
              <td>{f?.marketCap ?? "-"}</td>
              <td>{f?.dividendYield ?? "-"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default StockTable;
