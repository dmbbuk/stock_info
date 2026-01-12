// data만 받아서 표를 그려주는 역할(Presentation)
import { useState, useEffect } from "react";
import {
  ColumnDef,
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

const columns: ColumnDef<StockRow>[] = [
  { accessorKey: "ticker", header: "티커" },
  { accessorKey: "name", header: "회사명" },
  { accessorKey: "price", header: "가격" },
  { accessorKey: "marketCap", header: "시가총액" },
  { accessorKey: "volume", header: "거래량" },
  { accessorKey: "PER", header: "PER" },
  { accessorKey: "summary", header: "요약" },
];

interface StockDataTableProps {
  data: StockRow[];
}

export default function StockDataTable({ data }: StockDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageSize, setPageSize] = useState(20);
  const [pageIndex, setPageIndex] = useState(0);

  // 데이터 목록이 바뀌면(검색 등) 페이지 인덱스 초기화
  useEffect(() => {
    setPageIndex(0);
  }, [data.length]);

  const table = useReactTable({
    data,
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
    <div>
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
