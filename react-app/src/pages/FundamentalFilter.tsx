import type { FilterKey, Filters } from "shared-types/src/filterSetTypes";

type Props = {
  filters: Filters;
  onChange: (field: FilterKey, value: string) => void;
};

// ① 한글 라벨 변환
const FILTER_LABELS: Record<string, string> = {
  ALL: "전체",
  "-0": "0 미만",
  "0-1": "0~1",
  "1-2": "1~2",
  "1-3": "1~3",
  "1-5": "1~5",
  "1-10": "1~10",
  "2-5": "2~5",
  "3-5": "3~5",
  "3-10": "3~10",
  "5-10": "5~10",
  "5-20": "5~20",
  "10-20": "10~20",
  "10-40": "10~40",
  "10-100": "10~100",
  "20-40": "20~40",
  "20-100": "20~100",
  "50-100": "50~100",
  "100-300": "100~300",
  "0-0.05": "0~0.05",
  "0.05-0.1": "0.05~0.1",
  "0.1-0.3": "0.1~0.3",
  "0.3-": "0.3 이상",
  "0.5-1": "0.5~1",
  "1-": "1 이상",
  "5-": "5 이상",
  "10-": "10 이상",
  "15-": "15 이상",
  "20-": "20 이상",
  "40-": "40 이상",
  "100-": "100 이상",
  "300-": "300 이상",
  "100000-": "10만 이상",
  "1000000-": "100만 이상",
  "10000000-": "1,000만 이상",
  "100000000-": "1억 이상",
  "1000000000-": "10억 이상",
  "5000000000-": "50억 이상",
  "10000000000-": "100억 이상",
  "20000000000-": "200억 이상",
  "-1": "1 미만",
  "-3": "3 미만",
  "-5": "5 미만",
  "-10": "10 미만",
  "-20": "20 미만",
  "-50": "50 미만",
  "-100": "100 미만",
  "-300": "300 미만",
  "-100000": "10만 미만",
  "-1000000": "100만 미만",
  "-10000000": "1,000만 미만",
  "-100000000": "1억 미만",
  "-1000000000": "10억 미만",
  "-5000000000": "50억 미만",
  "-10000000000": "100억 미만",
  "-20000000000": "200억 미만",
};

const FILTER_OPTIONS: Record<FilterKey, string[]> = {
  PER: ["ALL", "-10", "10-20", "20-40", "40-"],
  EPS: ["ALL", "-0", "0-1", "1-5", "5-"],
  PBR: ["ALL", "-1", "1-2", "2-5", "5-"],
  dividendYield: ["ALL", "-1", "1-3", "3-5", "5-"],
  PEG: ["ALL", "-0.5", "0.5-1", "1-2", "2-"],
  payoutRatio: ["ALL", "-0.2", "0.2-0.5", "0.5-1", "1-"],
  roe: ["ALL", "-0", "0-10", "10-20", "20-"],
  epsGrowth: ["ALL", "-0", "0-0.1", "0.1-0.3", "0.3-"],
  revenueGrowth: ["ALL", "-0", "0-0.1", "0.1-0.3", "0.3-"],
  evEbitda: ["ALL", "-5", "5-10", "10-20", "20-"],
  operatingMargin: ["ALL", "-0", "0-10", "10-20", "20-"],
  profitMargin: ["ALL", "-0", "0-10", "10-20", "20-"],
  evEbit: ["ALL", "-5", "5-10", "10-20", "20-"],
  EBITDA: [
    "ALL",
    "-100000000",
    "100000000-500000000",
    "500000000-1000000000",
    "1000000000-",
  ],
  WallStreetTargetPrice: ["ALL", "-50", "50-100", "100-300", "300-"],
  BookValue: ["ALL", "-5", "5-10", "10-20", "20-"],
  DividendShare: ["ALL", "-1", "1-2", "2-5", "5-"],
  EPSEstimateCurrentYear: ["ALL", "-0", "0-1", "1-5", "5-"],
  EPSEstimateNextYear: ["ALL", "-0", "0-1", "1-5", "5-"],
  EPSEstimateNextQuarter: ["ALL", "-0", "0-1", "1-3", "3-"],
  EPSEstimateCurrentQuarter: ["ALL", "-0", "0-1", "1-3", "3-"],
  ReturnOnAssetsTTM: ["ALL", "-0", "0-0.05", "0.05-0.1", "0.1-"],
  RevenueTTM: [
    "ALL",
    "-100000000",
    "100000000-1000000000",
    "1000000000-10000000000",
    "10000000000-",
  ],
  RevenuePerShareTTM: ["ALL", "-5", "5-10", "10-20", "20-"],
  QuarterlyRevenueGrowthYOY: ["ALL", "-0", "0-0.1", "0.1-0.3", "0.3-"],
  GrossProfitTTM: [
    "ALL",
    "-100000000",
    "100000000-1000000000",
    "1000000000-10000000000",
    "10000000000-",
  ],
  QuarterlyEarningsGrowthYOY: ["ALL", "-0", "0-0.1", "0.1-0.3", "0.3-"],
  marketCap: [
    "ALL",
    "-1000000000",
    "1000000000-5000000000",
    "5000000000-20000000000",
    "20000000000-",
  ],
  volume: ["ALL", "-100000", "100000-1000000", "1000000-10000000", "10000000-"],
  sector: [],
};

// (참고) 계산용 파싱 함수: 필요시 filter logic에서 사용
export function parseRangeFilter(
  filter: string
): { min?: number; max?: number } | null {
  if (filter === "ALL") return null;
  // '-10'
  if (filter.startsWith("-")) return { max: parseFloat(filter.slice(1)) };
  // '10-'
  if (filter.endsWith("-")) return { min: parseFloat(filter.slice(0, -1)) };
  // '10-20'
  if (filter.includes("-")) {
    const [min, max] = filter.split("-");
    return { min: parseFloat(min), max: parseFloat(max) };
  }
  return null;
}

export default function FundamentalFilter({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-4 mb-4 text-sm text-white">
      {Object.entries(FILTER_OPTIONS).map(([field, options]) => (
        <div key={field} className="flex flex-col">
          <label className="mb-1 font-semibold uppercase">{field}</label>
          <select
            value={filters[field as FilterKey] || "ALL"}
            onChange={(e) => onChange(field as FilterKey, e.target.value)}
            className="bg-[#2A2A40] text-white border border-[#444] rounded-md px-2 py-1 text-sm"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {FILTER_LABELS[opt] ?? opt}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
