// src/pages/StockTable.tsx
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

export default function StockTable() {
  const stocks = useStockSocket(); // WebSocket 연결 시도 (on mount)
  const tickers = Object.keys(stocks);

  console.log(stocks);

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickers.map((ticker) => {
              const trade = stocks[ticker];
              return (
                <TableRow key={ticker}>
                  <TableCell>{trade.s}</TableCell>
                  <TableCell className="animate-pulse">
                    {trade.p.toFixed(2)}
                  </TableCell>
                  <TableCell>{trade.v}</TableCell>
                  <TableCell>
                    {new Date(trade.t).toLocaleTimeString()}
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
