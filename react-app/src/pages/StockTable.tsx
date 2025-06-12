import { useEffect, useMemo, useState } from "react";
import { useStockSocket } from "../hooks/useStockSocket";
import { fetchFundamentalsFor } from "../components/service/fundamentalsFetcher";
import { formatTime } from "../utils/formatTime";
import type { Fundamentals } from "shared-types/src/fundamentals";
import type { RealtimePrice } from "shared-types/src/realtime";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
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

type StockRow = {
  ticker: string;
  price: string;
  time: string;
  PER: string;
  PBR: string;
  EPS: string;
  marketCap: string;
  dividendYield: string;
  volume: string;
};

const StockTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tickers, setTickers] = useState<string[]>([]);
  const [fundamentals, setFundamentals] = useState<
    Record<string, Fundamentals>
  >({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageSize, setPageSize] = useState(20);
  const [pageIndex, setPageIndex] = useState(0);

  const [fundamentalFilters, setFundamentalFilters] = useState({
    per: "ALL",
    eps: "ALL",
    pbr: "ALL",
    dividend: "ALL",
  });

  const [enabledMetrics, setEnabledMetrics] = useState([
    "PER",
    "EPS",
    "PBR",
    "marketCap",
    "dividendYield",
  ]);

  const updateFundamentalFilter = (
    key: keyof typeof fundamentalFilters,
    value: string
  ) => {
    setFundamentalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const fetchHotTickers = async () => {
    const res = await fetch("http://localhost:3000/api/stocks/hot-tickers");
    const { tickers, fundamentals } = await res.json();
    setTickers(tickers);
    if (fundamentals && Object.keys(fundamentals).length > 0) {
      setFundamentals(fundamentals);
    }
  };

  useEffect(() => {
    fetchHotTickers();
  }, []);

  const { latestPrices, subscribeTickers } = useStockSocket(tickers);

  useEffect(() => {
    if (tickers.length === 0) return;
    subscribeTickers(tickers);

    if (Object.keys(fundamentals).length > 0) return;

    const loadFundamentals = async () => {
      const data = await fetchFundamentalsFor(tickers);
      setFundamentals(data);
    };
    loadFundamentals();
  }, [tickers]);

  const allData: StockRow[] = useMemo(() => {
    return tickers.map((ticker) => {
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
        volume: f?.volume?.toLocaleString() ?? "-",
      };
    });
  }, [tickers, latestPrices, fundamentals]);

  const filteredData = useMemo(() => {
    let filtered = allData;

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.ticker.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const { per, eps, pbr, dividend } = fundamentalFilters;

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
          volume: "거래량",
        }[key] ?? key,
    }));

    return [...base, ...dynamic];
  }, [enabledMetrics]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      pagination: {
        pageSize,
        pageIndex,
      },
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageSize, pageIndex })
          : updater;

      if (newPagination.pageIndex !== pageIndex)
        setPageIndex(newPagination.pageIndex);

      if (newPagination.pageSize !== pageSize)
        setPageSize(newPagination.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    // 👇 이거 꼭 추가해야 "페이지 유지"됨
    autoResetPageIndex: false,
  });

  return (
    <div className="p-6 bg-[#1E1E2F] text-white min-h-screen">
      <SearchBar searchQuery={searchQuery} onChange={setSearchQuery} />
      <FundamentalSettings
        enabledMetrics={enabledMetrics}
        onChange={setEnabledMetrics}
      />
      <div className="mb-4 flex gap-2">
        <button
          onClick={fetchHotTickers}
          className="bg-[#FF4C4C] text-white px-3 py-1 rounded text-sm"
        >
          HOT한 종목 100개
        </button>
      </div>
      <FundamentalFilter
        filters={fundamentalFilters}
        onChange={updateFundamentalFilter}
      />

      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">실시간 주식 데이터</h1>
        <div className="flex items-center gap-2 text-sm">
          <label>페이지당 보기:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              setPageSize(newSize);
              setPageIndex(0); // 👈 페이지 사이즈 바꾸면 1페이지로
            }}
            className="text-black rounded px-2 py-1"
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}개
              </option>
            ))}
          </select>
        </div>
      </div>

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
                  className={`px-4 py-1 ${
                    !isNaN(
                      Number(String(cell.getValue()).replace(/[%,$,]/g, ""))
                    )
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end items-center mt-4 gap-4 text-sm">
        <span>
          총 {filteredData.length}개 중 {pageIndex * pageSize + 1}~
          {Math.min((pageIndex + 1) * pageSize, filteredData.length)}개 표시 중
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-40"
          >
            이전
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-40"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockTable;
