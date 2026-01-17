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
}

export default function StockDataTable({
  data,
  enabledMetrics,
}: StockDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  // 데이터 목록이 바뀌면(검색 등) 페이지 인덱스 초기화
  useEffect(() => {
    setPageIndex(0);
  }, [data.length]);

  const table = useReactTable({
    data,
    columns: stockTableColumns, // 전체 컬럼을 다 집어넣고
    state: {
      sorting,
      pagination: {
        pageSize,
        pageIndex,
      },
      // React-Table 의 Visibility 기능을 이용해 숨김 처리
      columnVisibility: useMemo(() => {
        if (!enabledMetrics) return {}; // 모두 보임
        
        const visibility: Record<string, boolean> = {};
        // 1. 일단 모두 숨김 처리
        stockTableColumns.forEach((col) => {
          const key = (col as any).accessorKey;
          visibility[key] = false;
        });
        
        // 2. 활성화된 것만 true
        enabledMetrics.forEach((metric) => {
          visibility[metric] = true;
        });

        return visibility;
      }, [enabledMetrics]),
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
    <div>
      <div className="flex justify-end items-center mb-2">
        <div className="flex items-center gap-2 text-sm">
          <label className="text-gray-400">페이지당 보기:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              setPageSize(newSize);
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
                  className="px-4 py-1 text-left"
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
          총 {data.length}개 중 {pageIndex * pageSize + 1}~
          {Math.min((pageIndex + 1) * pageSize, data.length)}개 표시 중
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
}
