// data만 받아서 표를 그려주는 역할(Presentation)
import { useState, useEffect, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StockRow } from "@/assets/type/type";
import { stockTableColumns } from "./StockTableColumns";

interface StockDataTableProps {
  data: StockRow[];
  enabledMetrics?: string[];
  isLoading?: boolean;
}

// 행 높이 고정 (줄바꿈 방지 및 스켈레톤 일치용)
const ROW_HEIGHT = 32;

export default function StockDataTable({
  data,
  enabledMetrics,
  isLoading = false,
}: StockDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // 화면 크기에 따른 페이지 사이즈 계산
  const getResponsivePageSize = () => {
    // SSR 환경 대비
    if (typeof window === "undefined") return 10;

    // 상단 UI 높이(헤더, 필터 등) + 하단 여백 대략적 계산
    const FIXED_UI_HEIGHT = 280;
    const availableHeight = window.innerHeight - FIXED_UI_HEIGHT;

    // 나눗셈으로 가능한 행 개수 계산
    const possibleRows = Math.floor(availableHeight / ROW_HEIGHT);

    // 20개 이상 들어갈 공간이 충분하면 20, 아니면 10 (사용자 요청 정책)
    return possibleRows >= 20 ? 20 : 10;
  };

  // 초기값 함수로 전달 -> 마운트 시점 즉시 계산 (깜빡임 방지 핵심)
  const [pageSize, setPageSize] = useState(() => getResponsivePageSize());
  const [pageIndex, setPageIndex] = useState(0);

  // 리사이즈 이벤트 리스너
  useEffect(() => {
    const handleResize = () => {
      setPageSize(getResponsivePageSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 데이터 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setPageIndex(0);
  }, [data.length]);

  const table = useReactTable({
    data,
    columns: stockTableColumns,
    state: {
      sorting,
      pagination: {
        pageSize,
        pageIndex,
      },
      columnVisibility: useMemo(() => {
        if (!enabledMetrics) return {};

        const visibility: Record<string, boolean> = {};
        stockTableColumns.forEach((col) => {
          if ("accessorKey" in col) {
            visibility[col.accessorKey as string] = false;
          }
        });

        enabledMetrics.forEach((metric) => {
          visibility[metric] = true;
        });

        return visibility;
      }, [enabledMetrics]),
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      // updater가 함수일 수도, 값일 수도 있음
      let newPageIndex = pageIndex;
      let newPageSize = pageSize;

      if (typeof updater === "function") {
        const state = updater({ pageIndex, pageSize });
        newPageIndex = state.pageIndex;
        newPageSize = state.pageSize;
      } else {
        newPageIndex = updater.pageIndex;
        newPageSize = updater.pageSize;
      }

      setPageIndex(newPageIndex);
      setPageSize(newPageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
  });

  return (
    <div>
      {/* 보기 설정 드롭다운 */}
      <div className="flex justify-end items-center mb-1">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <label>Rows:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageIndex(0);
            }}
            className="bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a] rounded px-2 py-0.5 focus:outline-none focus:border-blue-500"
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Table className="text-xs">
        <TableHeader className="bg-[#1a1a1a] sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="text-gray-400 border-b border-[#2a2a2a]">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer px-3 py-0 select-none text-gray-400 hover:text-white transition-colors"
                  style={{ height: "34px" }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === "asc" && " ▲"}
                  {header.column.getIsSorted() === "desc" && " ▼"}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: pageSize }).map((_, i) => (
                <TableRow
                  key={`skeleton-${i}`}
                  className={`border-b border-[#1e1e1e] ${i % 2 === 0 ? "bg-[#0d0d0d]" : "bg-[#111]"}`}
                >
                  {table.getVisibleFlatColumns().map((col) => (
                    <TableCell key={col.id} className="p-0">
                      <div
                        style={{ height: `${ROW_HEIGHT}px` }}
                        className="w-full flex items-center px-3"
                      >
                        <div className="h-3 w-full bg-[#222] rounded animate-pulse" />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`border-b border-[#1e1e1e] hover:bg-[#1a2535] transition-colors ${
                    row.index % 2 === 0 ? "bg-[#0d0d0d]" : "bg-[#111]"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-0 text-left">
                      <div
                        style={{ height: `${ROW_HEIGHT}px` }}
                        className="flex items-center px-3 w-full"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}

          {!isLoading &&
            table.getRowModel().rows.length < pageSize &&
            Array.from({ length: pageSize - table.getRowModel().rows.length }).map((_, i) => {
              const rowIndex = table.getRowModel().rows.length + i;
              return (
                <TableRow
                  key={`empty-${i}`}
                  className={`border-b border-[#1e1e1e] ${rowIndex % 2 === 0 ? "bg-[#0d0d0d]" : "bg-[#111]"}`}
                >
                  <TableCell colSpan={table.getVisibleFlatColumns().length} className="p-0">
                    <div style={{ height: `${ROW_HEIGHT}px` }}></div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>

      <div className="flex justify-end items-center mt-2 gap-3 text-xs text-gray-500">
        <span>
          {isLoading ? "" : (
            <>
              {pageIndex * pageSize + 1}–{Math.min((pageIndex + 1) * pageSize, data.length)} / {data.length}
            </>
          )}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoading}
            className="px-2.5 py-0.5 bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 rounded hover:text-white disabled:opacity-30 transition-colors"
          >
            ‹ Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isLoading}
            className="px-2.5 py-0.5 bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 rounded hover:text-white disabled:opacity-30 transition-colors"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
}
