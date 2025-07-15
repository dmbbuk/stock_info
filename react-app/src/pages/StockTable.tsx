import { useEffect, useMemo, useState } from "react";
import { fetchFundamentalsFor } from "../components/service/fundamentalsFetcher";
import type { FundamentalData } from "shared-types/src/fundamentalTypes";
import type { FilterSetTypes } from "shared-types/src/FilterSetTypes";
import { fetchDailyClosePriceFor } from "../components/service/dailyPriceFetcher";

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
import PredefinedFilterTabs from "./PredefinedFilterTabs";

// 표시용 테이블 필드만
type StockRow = {
  ticker: string;
  name: string;
  price: string;
  marketCap: string;
  volume: string;
  PER: string;
  summary: string;
};

// 필터 문자열 파싱 함수
function parseRangeFilter(
  filter: string
): { min?: number; max?: number } | null {
  if (!filter || filter === "ALL") return null;
  if (filter.startsWith("-")) return { max: parseFloat(filter.slice(1)) };
  if (filter.endsWith("-")) return { min: parseFloat(filter.slice(0, -1)) };
  if (filter.includes("-")) {
    const [min, max] = filter.split("-");
    return { min: parseFloat(min), max: parseFloat(max) };
  }
  return null;
}

const StockTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tickers, setTickers] = useState<string[]>([]);
  const [fundamentals, setFundamentals] = useState<
    Record<string, FundamentalData>
  >({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageSize, setPageSize] = useState(20);
  const [pageIndex, setPageIndex] = useState(0);
  const [dailyCloses, setDailyCloses] = useState<Record<string, number>>({});
  const [showCustomFilter, setShowCustomFilter] = useState(false);

  // 필터의 기본 상태
  const initialFilterState: FilterSetTypes = {
    PER: "ALL",
    EPS: "ALL",
    PBR: "ALL",
    dividendYield: "ALL",
    PEG: "ALL",
    payoutRatio: "ALL",
    roe: "ALL",
    epsGrowth: "ALL",
    revenueGrowth: "ALL",
    evEbitda: "ALL",
    operatingMargin: "ALL",
    profitMargin: "ALL",
    evEbit: "ALL",
    EBITDA: "ALL",
    WallStreetTargetPrice: "ALL",
    BookValue: "ALL",
    DividendShare: "ALL",
    EPSEstimateCurrentYear: "ALL",
    EPSEstimateNextYear: "ALL",
    EPSEstimateNextQuarter: "ALL",
    EPSEstimateCurrentQuarter: "ALL",
    ReturnOnAssetsTTM: "ALL",
    RevenueTTM: "ALL",
    RevenuePerShareTTM: "ALL",
    QuarterlyRevenueGrowthYOY: "ALL",
    GrossProfitTTM: "ALL",
    QuarterlyEarningsGrowthYOY: "ALL",
    marketCap: "ALL",
    volume: "ALL",
  };

  const [fundamentalFilters, setFundamentalFilters] =
    useState(initialFilterState);

  // 컬럼 세팅 (표시 컬럼만)
  const enabledMetrics = [
    "ticker",
    "name",
    "price",
    "marketCap",
    "volume",
    "PER",
    "summary",
  ];

  // 최초 마운트 시 fundamentals 전체 fetch
  useEffect(() => {
    const fetchAllFundamentals = async () => {
      const data = await fetchFundamentalsFor();
      setFundamentals(data);
      setTickers(Object.keys(data));
    };
    fetchAllFundamentals();
  }, []);

  // 종가 fetch
  useEffect(() => {
    if (tickers.length === 0) return;
    const loadDailyCloses = async () => {
      const closes = await fetchDailyClosePriceFor(tickers);
      setDailyCloses(closes);
    };
    loadDailyCloses();
  }, [tickers]);

  useEffect(() => setPageIndex(0), [searchQuery]);

  // 숫자/문자 변환 유틸
  const getNumberOrDash = (val?: number | string, digits = 2, suffix = "") =>
    val != null && val !== ""
      ? typeof val === "number"
        ? val.toFixed(digits) + suffix
        : val
      : "-";

  // 1. 필터 조건에 부합하는 티커만 남김 (모든 필드 대상)
  const filteredTickers = useMemo(() => {
    return tickers.filter((ticker) => {
      const f = fundamentals[ticker];
      if (!f) return false;
      // 모든 필터 조건을 통과해야 남김
      return Object.entries(fundamentalFilters).every(([key, filterValue]) => {
        if (filterValue === "ALL") return true;
        // sector 등 문자열 필드는 따로 처리하고 싶으면 추가
        const raw = f[key as keyof FundamentalData];
        if (raw == null) return false;
        // 숫자형 비교
        const value =
          typeof raw === "string"
            ? parseFloat(raw.replace(/,/g, ""))
            : Number(raw);
        if (isNaN(value)) return false;
        const range = parseRangeFilter(filterValue);
        if (!range) return true;
        if (range.min !== undefined && value < range.min) return false;
        if (range.max !== undefined && value >= range.max) return false;
        return true;
      });
    });
  }, [tickers, fundamentals, fundamentalFilters]);

  // 2. 이 티커들만 표 데이터로 가공 (표시용 필드만)
  const allData: StockRow[] = useMemo(() => {
    return filteredTickers.map((ticker) => {
      const f = fundamentals[ticker];
      const closePrice = dailyCloses[ticker];

      const summaryArr = [
        f?.sector ?? "",
        f?.dividendYield
          ? `배당 ${getNumberOrDash(f.DividendShare, 2, "%")}`
          : "",
        f?.EPS != null ? `EPS ${getNumberOrDash(f.EPS)}` : "",
        f?.PBR != null ? `PBR ${getNumberOrDash(f.PBR)}` : "",
      ];
      const summary = summaryArr.filter(Boolean).join(" / ");

      return {
        ticker,
        name: f?.name ?? "-",
        price: closePrice != null ? closePrice.toFixed(2) : "-",
        marketCap: f?.marketCap ? Number(f.marketCap).toLocaleString() : "-",
        volume: f?.volume ? Number(f.volume).toLocaleString() : "-",
        PER: f?.PER != null ? getNumberOrDash(f.PER) : "-",
        summary,
      };
    });
  }, [filteredTickers, dailyCloses, fundamentals]);

  // 검색(티커/회사명)
  const searchedData = useMemo(() => {
    if (!searchQuery) return allData;
    return allData.filter(
      (item) =>
        item.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allData, searchQuery]);

  // 컬럼 정의
  const columns: ColumnDef<StockRow>[] = [
    { accessorKey: "ticker", header: "티커" },
    { accessorKey: "name", header: "회사명" },
    { accessorKey: "price", header: "가격" },
    { accessorKey: "marketCap", header: "시가총액" },
    { accessorKey: "volume", header: "거래량" },
    { accessorKey: "PER", header: "PER" },
    { accessorKey: "summary", header: "요약" },
  ];

  // React Table 인스턴스
  const table = useReactTable({
    data: searchedData,
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
    autoResetPageIndex: false,
  });

  return (
    <div className="p-6 bg-[#1E1E2F] text-white min-h-screen">
      <SearchBar searchQuery={searchQuery} onChange={setSearchQuery} />
      <FundamentalSettings
        enabledMetrics={enabledMetrics}
        onChange={() => {}}
      />
      <PredefinedFilterTabs
        onApplyFilter={(partialFilters) => {
          setFundamentalFilters({
            ...initialFilterState,
            ...partialFilters,
          });
        }}
      />
      {showCustomFilter && (
        <div className="mt-2">
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm text-gray-300">
              필터 조건을 선택하세요
            </span>
          </div>
          <FundamentalFilter
            filters={fundamentalFilters}
            onChange={(field, value) => {
              setFundamentalFilters((prev) => ({
                ...prev,
                [field]: value,
              }));
            }}
          />
        </div>
      )}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setShowCustomFilter((prev) => !prev)}
          className="bg-[#444466] text-white text-sm px-3 py-1 rounded"
        >
          {showCustomFilter ? "필터링 닫기" : "커스텀 필터링"}
        </button>
        {showCustomFilter && (
          <button
            onClick={() => setFundamentalFilters(initialFilterState)}
            className="bg-gray-600 text-white text-sm px-3 py-1 rounded hover:bg-gray-500"
          >
            필터링 초기화
          </button>
        )}
      </div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">실시간 주식 데이터</h1>
        <div className="flex items-center gap-2 text-sm">
          <label>페이지당 보기:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              setPageSize(newSize);
              setPageIndex(0);
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
          총 {searchedData.length}개 중 {pageIndex * pageSize + 1}~
          {Math.min((pageIndex + 1) * pageSize, searchedData.length)}개 표시 중
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
