// src/pages/StockTable.tsx
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import useStockSocket from "../hooks/useStockSocket";
import {
  fetchFundamentalsFor,
  Fundamentals,
} from "../components/service/fundamentalsFetcher";

const watchedTickers = [
  "AAPL",
  "MSFT",
  "TSLA",
  "BINANCE:BTCUSDT",
  "BINANCE:ETHUSDT",
];

export default function StockTable() {
  const stocks = useStockSocket(); // WebSocket 연결 시도 (on mount)
  // const tickers = Object.keys(stocks); // 실제로 웹소켓으로 통신한 티커
  const [fundamentals, setFundamentals] = useState<
    Record<string, Fundamentals>
  >({});

  useEffect(() => {
    const load = async () => {
      const data = await fetchFundamentalsFor(
        watchedTickers.filter((t) => !t.startsWith("BINANCE:"))
      );
      setFundamentals(data);
    };
    load();
  }, []);

  console.log(stocks);

  // const temp = async () => {
  //   const res = await fetch(
  //     `http://localhost:3001/api/stocks/fundamentals?symbol=AAPL`
  //   );
  //   const data = await res.json();
  //   console.log("temp data", data); // 여기에서 출력
  // };

  // temp();

  return (
    <Card className="bg-white text-black">
      <CardContent className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">종목</TableHead>
              <TableHead className="text-left">가격</TableHead>
              <TableHead className="text-left">수량</TableHead>
              <TableHead className="text-left">시간</TableHead>
              <TableHead className="text-left">PER</TableHead>
              <TableHead className="text-left">EPS</TableHead>
              <TableHead className="text-left">시가총액</TableHead>
              <TableHead className="text-left">PBR</TableHead>
              <TableHead className="text-left">배당수익률</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {watchedTickers.map((ticker) => {
              const trade = stocks[ticker];
              const f = fundamentals[ticker];

              return (
                <TableRow key={ticker}>
                  <TableCell>{ticker}</TableCell>
                  <TableCell>{trade?.p?.toFixed(2) ?? "N/A"}</TableCell>
                  <TableCell>{trade?.v ?? "N/A"}</TableCell>
                  <TableCell>
                    {trade?.t ? new Date(trade.t).toLocaleTimeString() : "N/A"}
                  </TableCell>
                  <TableCell>{f?.per?.toFixed(2) ?? "N/A"}</TableCell>
                  <TableCell>{f?.eps?.toFixed(2) ?? "N/A"}</TableCell>
                  <TableCell>
                    {f?.marketCap?.toLocaleString() ?? "N/A"}
                  </TableCell>
                  <TableCell>{f?.pbr?.toFixed(2) ?? "N/A"}</TableCell>
                  <TableCell>
                    {f?.dividendYield?.toFixed(2) ?? "N/A"}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
