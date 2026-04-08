import { ColumnDef } from "@tanstack/react-table";
import { StockRow } from "@/assets/type/type";
import { formatNumberOrDash } from "@/lib/utils";

const rightAlign = "text-right w-full";

export const stockTableColumns: ColumnDef<StockRow>[] = [
  // --- 기본 정보 (Basic) ---
  {
    accessorKey: "ticker",
    header: "티커",
  },
  {
    accessorKey: "name",
    header: "회사명",
  },
  {
    accessorKey: "sector",
    header: "섹터",
  },
  {
    accessorKey: "price",
    header: () => <div className={rightAlign}>가격</div>,
    cell: ({ getValue }) => (
      <div className={rightAlign}>
        {formatNumberOrDash(getValue() as number)}
      </div>
    ),
  },

  // --- 1순위: 필수 필터 (Essential) ---
  {
    accessorKey: "marketCap",
    header: () => <div className={rightAlign}>시가총액</div>,
    cell: ({ getValue }) => {
      const val = getValue() as number | string;
      const text = typeof val === "number" ? val.toLocaleString() : val;
      return <div className={rightAlign}>{text}</div>;
    },
  },
  {
    accessorKey: "PER",
    header: () => <div className={rightAlign}>PER</div>,
    cell: ({ getValue }) => (
      <div className={rightAlign}>
        {formatNumberOrDash(getValue() as number)}
      </div>
    ),
  },
  {
    accessorKey: "roe",
    header: () => <div className={rightAlign}>ROE</div>,
    cell: ({ getValue }) => (
      <div className={rightAlign}>
        {formatNumberOrDash(getValue() as number, 2, "%")}
      </div>
    ),
  },
  {
    accessorKey: "dividendYield",
    header: () => <div className={rightAlign}>배당수익률</div>,
    cell: ({ getValue }) => (
      <div className={rightAlign}>
        {formatNumberOrDash(getValue() as number, 2, "%")}
      </div>
    ),
  },

  // --- 2순위: 성장 & 수익성 (Growth & Profitability) ---
  {
    accessorKey: "revenueGrowth",
    header: () => <div className={rightAlign}>매출성장률</div>,
    cell: ({ getValue }) => (
      <div className={rightAlign}>
        {formatNumberOrDash(getValue() as number, 2, "%")}
      </div>
    ),
  },
  {
    accessorKey: "epsGrowth",
    header: () => <div className={rightAlign}>EPS성장률</div>,
    cell: ({ getValue }) => (
      <div className={rightAlign}>
        {formatNumberOrDash(getValue() as number, 2, "%")}
      </div>
    ),
  },
  {
    accessorKey: "operatingMargin",
    header: () => <div className={rightAlign}>영업이익률</div>,
    cell: ({ getValue }) => (
      <div className={rightAlign}>
        {formatNumberOrDash(getValue() as number, 2, "%")}
      </div>
    ),
  },
  {
    accessorKey: "profitMargin",
    header: () => <div className={rightAlign}>순이익률</div>,
    cell: ({ getValue }) => (
      <div className={rightAlign}>
        {formatNumberOrDash(getValue() as number, 2, "%")}
      </div>
    ),
  },

  // --- 3순위: 세부 지표 (Details) ---
  {
    accessorKey: "PBR",
    header: () => <div className={rightAlign}>PBR</div>,
    cell: ({ getValue }) => (
      <div className={rightAlign}>
        {formatNumberOrDash(getValue() as number)}
      </div>
    ),
  },
  {
    accessorKey: "evEbitda",
    header: () => <div className={rightAlign}>EV/EBITDA</div>,
    cell: ({ getValue }) => (
      <div className={rightAlign}>
        {formatNumberOrDash(getValue() as number)}
      </div>
    ),
  },
  {
    accessorKey: "PEG",
    header: () => <div className={rightAlign}>PEG</div>,
    cell: ({ getValue }) => (
      <div className={rightAlign}>
        {formatNumberOrDash(getValue() as number)}
      </div>
    ),
  },
  {
    accessorKey: "EPS",
    header: () => <div className={rightAlign}>EPS</div>,
    cell: ({ getValue }) => (
      <div className={rightAlign}>
        {formatNumberOrDash(getValue() as number)}
      </div>
    ),
  },
  {
    accessorKey: "volume",
    header: () => <div className={rightAlign}>거래량</div>,
    cell: ({ getValue }) => {
      const val = getValue() as number | string;
      const text = typeof val === "number" ? val.toLocaleString() : val;
      return <div className={rightAlign}>{text}</div>;
    },
  },

  // --- Technicals (Finviz Style) ---
  {
    accessorKey: "Week52High",
    header: () => <div className={rightAlign}>52주 최고</div>,
    cell: ({ row }) => {
      const current = Number(row.original.price);
      if (isNaN(current)) return <div className={rightAlign}>-</div>;

      const high = Number(row.original.Week52High);
      if (!high) return <div className={rightAlign}>-</div>;

      const diff = ((current - high) / high) * 100;
      const colorClass = diff > -5 ? "text-red-400" : "text-gray-400"; // 신고가 근접 시 빨간색 강조

      return (
        <div className="flex flex-row items-center justify-end gap-1">
          <span>
            {high.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className={`text-xs ${colorClass}`}>({diff.toFixed(1)}%)</span>
        </div>
      );
    },
  },
  {
    accessorKey: "Week52Low",
    header: () => <div className={rightAlign}>52주 최저</div>,
    cell: ({ row }) => {
      const current = Number(row.original.price);
      if (isNaN(current)) return <div className={rightAlign}>-</div>;

      const low = Number(row.original.Week52Low);
      if (!low) return <div className={rightAlign}>-</div>;

      const diff = ((current - low) / low) * 100;
      const colorClass = diff < 5 ? "text-blue-400" : "text-gray-400"; // 신저가 근접(바닥) 시 파란색 강조 (한국식)

      return (
        <div className="flex flex-row items-center justify-end gap-1">
          <span>
            {low.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className={`text-xs ${colorClass}`}>
            ({diff > 0 ? "+" : ""}
            {diff.toFixed(1)}%)
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "Day200MA",
    header: () => <div className={rightAlign}>추세(200일)</div>,
    cell: ({ row }) => {
      const current = Number(row.original.price);
      if (isNaN(current)) return <div className={rightAlign}>-</div>;

      const ma200 = Number(row.original.Day200MA);
      if (!ma200) return <div className={rightAlign}>-</div>;

      const isBull = current > ma200;
      return (
        <div
          className={`${rightAlign} ${isBull ? "text-red-400" : "text-blue-400"}`}
        >
          {isBull ? "상승장" : "하락장"}
        </div>
      );
    },
  },
];

// 순서를 보장하기 위한 키 배열도 여기서 추출하여 관리할 수 있습니다.
export const FIXED_COLUMN_ORDER = stockTableColumns
  .filter((col) => "accessorKey" in col)
  .map((col) => (col as { accessorKey: string }).accessorKey);
