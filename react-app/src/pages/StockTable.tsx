import { useEffect, useMemo, useState } from "react";
import { hotTickers } from "../constants/hotTickers";
import { useStockSocket } from "../hooks/useStockSocket";
import { fetchFundamentalsFor } from "../components/service/fundamentalsFetcher";
import { formatTime } from "../utils/formatTime";
import type { RealtimePrice } from "../types/realtime";
import type { Fundamentals } from "../types/fundamentals";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StockRow {
  ticker: string;
  price: string;
  time: string;
  PER: string;
  PBR: string;
  EPS: string;
  marketCap: string;
  dividendYield: string;
}

const StockTable = () => {
  const { latestPrices, subscribeTickers } = useStockSocket(hotTickers);
  const [fundamentals, setFundamentals] = useState<
    Record<string, Fundamentals>
  >({});
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    subscribeTickers(hotTickers);

    const loadFundamentals = async () => {
      const data = await fetchFundamentalsFor(hotTickers);
      setFundamentals(data);
    };
    loadFundamentals();
  }, []);

  const data: StockRow[] = useMemo(() => {
    return hotTickers.map((ticker) => {
      const priceData: RealtimePrice | undefined = latestPrices[ticker];
      const f = fundamentals[ticker];

      return {
        ticker,
        price: priceData?.price?.toFixed(2) ?? "-",
        time: formatTime(priceData?.timestamp),
        PER: f?.PER?.toFixed(2) ?? "-",
        PBR: f?.PBR?.toFixed(2) ?? "-",
        EPS: f?.EPS?.toFixed(2) ?? "-",
        marketCap: f?.marketCap?.toLocaleString() ?? "-",
        dividendYield:
          f?.dividendYield != null ? `${f.dividendYield.toFixed(2)}%` : "-",
      };
    });
  }, [latestPrices, fundamentals]);

  const columns: ColumnDef<StockRow>[] = [
    { accessorKey: "ticker", header: "Ticker" },
    { accessorKey: "price", header: "Price" },
    { accessorKey: "time", header: "Time", enableSorting: false },
    { accessorKey: "PER", header: "PER" },
    { accessorKey: "PBR", header: "PBR" },
    { accessorKey: "EPS", header: "EPS" },
    { accessorKey: "marketCap", header: "시가총액" },
    { accessorKey: "dividendYield", header: "배당수익률" },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer select-none"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getIsSorted() === "asc" && " ▲"}
                  {header.column.getIsSorted() === "desc" && " ▼"}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockTable;
