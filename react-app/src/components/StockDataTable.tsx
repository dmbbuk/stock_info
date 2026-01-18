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
const ROW_HEIGHT = 40;

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
      <div className="flex justify-end items-center mb-2">
        <div className="flex items-center gap-2 text-sm">
          <label className="text-gray-400">페이지당 보기:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageIndex(0);
            }}
            className="bg-[#2A2A40] text-white border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
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
                  style={{ height: "50px" }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {header.column.getIsSorted() === "asc" && " ▲"}
                  {header.column.getIsSorted() === "desc" && " ▼"}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading
            ? // 로딩 중일 때 스켈레톤 표시 (깜빡임 방지용 높이 고정)
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow
                  key={`skeleton-${i}`}
                  className="border-b border-[#2E2E3E]"
                >
                  {table.getVisibleFlatColumns().map((col) => (
                    <TableCell key={col.id} className="p-0">
                      <div
                        style={{ height: `${ROW_HEIGHT}px` }}
                        className="w-full flex items-center px-4"
                      >
                        <div className="h-4 w-full bg-[#33334D] rounded animate-pulse" />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  // 높이 강제 고정
                  className="hover:bg-[#33334D] border-b border-[#2E2E3E]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-0 text-left">
                      {/* 셀 내부 div에 높이 지정 */}
                      <div
                        style={{ height: `${ROW_HEIGHT}px` }}
                        className="flex items-center px-4 w-full"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}

          {/* 데이터 부족 시 빈 행 채우기 (레이아웃 유지) - 선택사항이지만 깜빡임 방지에 좋음 */}
          {!isLoading &&
            table.getRowModel().rows.length < pageSize &&
            Array.from({
              length: pageSize - table.getRowModel().rows.length,
            }).map((_, i) => (
              <TableRow
                key={`empty-${i}`}
                className="border-b border-[#2E2E3E]"
              >
                <TableCell
                  colSpan={table.getVisibleFlatColumns().length}
                  className="p-0"
                >
                  <div style={{ height: `${ROW_HEIGHT}px` }}></div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <div className="flex justify-end items-center mt-4 gap-4 text-sm">
        <span>
          {/* 데이터가 없거나 로딩중일때 처리 */}
          {isLoading ? (
            "로딩 중..."
          ) : (
            <>
              총 {data.length}개 중 {pageIndex * pageSize + 1}~
              {Math.min((pageIndex + 1) * pageSize, data.length)}개 표시 중
            </>
          )}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoading}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-40"
          >
            이전
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isLoading}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-40"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
