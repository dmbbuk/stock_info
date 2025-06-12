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
import FundamentalSettings from "./FundamentalSettings";
import FundamentalFilter from "./FundamentalFilter";

import SearchBar from "./SearchBar";

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
  // 검색바
  const [searchQuery, setSearchQuery] = useState("");

  const [fundamentalFilters, setFundamentalFilters] = useState({
    per: "ALL",
    eps: "ALL",
    pbr: "ALL",
    dividend: "ALL",
  });

  const updateFundamentalFilter = (
    key: keyof typeof fundamentalFilters,
    value: string
  ) => {
    setFundamentalFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 펀더멘탈 세팅
  const [enabledMetrics, setEnabledMetrics] = useState([
    "PER",
    "EPS",
    "PBR",
    "marketCap",
    "dividendYield",
  ]);

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

  const allData: StockRow[] = useMemo(() => {
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

  // searchQuery 적용된 필터링된 데이터 생성
  const filteredData = useMemo(() => {
    let filtered = allData;

    // 검색어
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.ticker.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const { per, eps, pbr, dividend } = fundamentalFilters;

    // PER 필터
    if (per !== "ALL") {
      filtered = filtered.filter((item) => {
        const value = parseFloat(item.PER);
        if (isNaN(value)) return false;
        if (per === "<10") return value < 10;
        if (per === "10-20") return value >= 10 && value < 20;
        if (per === "20-40") return value >= 20 && value < 40;
        if (per === "≥40") return value >= 40;
        return true;
      });
    }

    // EPS 필터
    if (eps !== "ALL") {
      filtered = filtered.filter((item) => {
        const value = parseFloat(item.EPS);
        if (isNaN(value)) return false;
        if (eps === "<1") return value < 1;
        if (eps === "1-5") return value >= 1 && value < 5;
        if (eps === "≥5") return value >= 5;
        return true;
      });
    }

    // PBR 필터
    if (pbr !== "ALL") {
      filtered = filtered.filter((item) => {
        const value = parseFloat(item.PBR);
        if (isNaN(value)) return false;
        if (pbr === "<1") return value < 1;
        if (pbr === "1-3") return value >= 1 && value < 3;
        if (pbr === "≥3") return value >= 3;
        return true;
      });
    }

    // 배당 필터
    if (dividend !== "ALL") {
      filtered = filtered.filter((item) => {
        const value = parseFloat(item.dividendYield.replace("%", ""));
        if (isNaN(value)) return false;
        if (dividend === "<1") return value < 1;
        if (dividend === "1-3") return value >= 1 && value < 3;
        if (dividend === "≥3") return value >= 3;
        return true;
      });
    }

    return filtered;
  }, [allData, searchQuery, fundamentalFilters]);

  const columns: ColumnDef<StockRow>[] = useMemo(() => {
    const base: ColumnDef<StockRow>[] = [
      { accessorKey: "ticker", header: "Ticker" },
      { accessorKey: "price", header: "Price" },
      { accessorKey: "time", header: "Time", enableSorting: false },
    ];

    const dynamic = enabledMetrics.map((key) => ({
      accessorKey: key,
      header:
        {
          PER: "PER",
          EPS: "EPS",
          PBR: "PBR",
          marketCap: "시가총액",
          dividendYield: "배당수익률",
        }[key] ?? key,
    }));

    return [...base, ...dynamic];
  }, [enabledMetrics]);

  // table data를 filteredData로 교체
  const table = useReactTable({
    data: filteredData, // ← 여기 수정됨
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <div className="p-6 bg-[#1E1E2F] text-white min-h-screen">
      <SearchBar searchQuery={searchQuery} onChange={setSearchQuery} />
      <FundamentalSettings
        enabledMetrics={enabledMetrics}
        onChange={setEnabledMetrics}
      />
      <FundamentalFilter
        filters={fundamentalFilters}
        onChange={updateFundamentalFilter}
      />
      <h1 className="text-2xl font-bold mb-4">실시간 주식 데이터</h1>
      <Table>
        <TableHeader className="bg-[#2A2A40] sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="text-white">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer px-4 py-2 select-none"
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
            <TableRow
              key={row.id}
              className="hover:bg-[#33334D] border-b border-[#2E2E3E]"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={`px-4 py-1 ${(() => {
                    const raw = cell.getValue();
                    const str =
                      typeof raw === "string" ? raw : String(raw ?? "");
                    return !isNaN(Number(str.replace(/[%,$,]/g, "")))
                      ? "text-right"
                      : "text-left";
                  })()}`}
                >
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
