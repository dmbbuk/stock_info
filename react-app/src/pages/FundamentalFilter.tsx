import type { FilterKey } from "shared-types/src/filterSetTypes";
import type { FilterRule } from "@/utils/filterEngine";

type Props = {
  // 규칙 객체 기반 (없으면 해당 필터 미적용)
  filters: Partial<Record<FilterKey, FilterRule | undefined>>;
  // 변경 핸들러: 규칙 객체 or undefined(ALL)
  onChange: (field: FilterKey, rule?: FilterRule) => void;
};

// ----- 라벨(표시 텍스트) -----
const LABELS: Record<string, string> = {
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
  "-15": "15 미만",
  "-20": "20 미만",
  "-25": "25 미만",
  "-40": "40 미만",
  "-50": "50 미만",
  "-100": "100 미만",
  "-300": "300 미만",
  "-0.6": "0.6 미만",
  "-1.5": "1.5 미만",
  "3-": "3 이상",
  "0.1-": "0.1 이상",
  "0.15-": "0.15 이상",
  "Technology": "기술 (Technology)",
  "earningsYield": "이익수익률 (EY)",
  "returnOnCapital": "자본수익률 (ROC)",
};

// ----- 필드명 라벨 (한글 매핑) -----
const FIELD_NAMES: Record<string, string> = {
  PER: "PER (주가수익비율)",
  EPS: "EPS (주당순이익)",
  PBR: "PBR (주가순자산비율)",
  dividendYield: "배당수익률 (%)",
  PEG: "PEG (주가이익증가비율)",
  payoutRatio: "배당성향",
  roe: "ROE (자기자본이익률)",
  epsGrowth: "EPS 성장률",
  revenueGrowth: "매출 성장률",
  evEbitda: "EV/EBITDA",
  operatingMargin: "영업이익률",
  profitMargin: "순이익률",
  evEbit: "EV/EBIT",
  EBITDA: "EBITDA",
  WallStreetTargetPrice: "월가 목표주가",
  BookValue: "BPS (주당순자산)",
  DividendShare: "주당 배당금",
  EPSEstimateCurrentYear: "올해 예상 EPS",
  EPSEstimateNextYear: "내년 예상 EPS",
  EPSEstimateNextQuarter: "다음 분기 예상 EPS",
  EPSEstimateCurrentQuarter: "이번 분기 예상 EPS",
  ReturnOnAssetsTTM: "ROA (총자산이익률)",
  RevenueTTM: "매출액 (TTM)",
  RevenuePerShareTTM: "주당 매출액 (SPS)",
  QuarterlyRevenueGrowthYOY: "분기 매출 성장률 (YoY)",
  GrossProfitTTM: "매출총이익 (TTM)",
  QuarterlyEarningsGrowthYOY: "분기 순이익 성장률 (YoY)",
  marketCap: "시가총액",
  volume: "거래량",
  sector: "섹터",
};

// ----- 필드별 옵션(토큰) -----
const OPTIONS: Record<FilterKey, string[]> = {
  PER: ["ALL", "-10", "-15", "-20", "-25", "10-20", "20-40", "-40", "40-"],
  EPS: ["ALL", "-0", "0-1", "1-5", "5-"],
  PBR: ["ALL", "-1", "-1.5", "1-2", "2-5", "5-"],
  dividendYield: ["ALL", "-1", "1-", "1-3", "3-", "3-5", "5-"],
  PEG: ["ALL", "-0.5", "-1", "0.5-1", "1-2", "2-"],
  payoutRatio: ["ALL", "-0.2", "0.2-0.5", "-0.6", "0.5-1", "-1", "1-"],
  roe: ["ALL", "-0", "0-10", "10-20", "15-", "20-"],
  epsGrowth: ["ALL", "-0", "0-0.1", "0.1-0.3", "0.15-", "0.3-"],
  revenueGrowth: ["ALL", "-0", "0-0.1", "0.1-", "0.1-0.3", "0.3-"],
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
  sector: ["ALL", "Technology"],
  earningsYield: ["ALL", "0.05-", "0.1-", "0.15-", "0.2-"],
  returnOnCapital: ["ALL", "0.1-", "0.2-", "0.3-", "0.5-", "1-"],
};

// ----- 토큰 ↔ 규칙 객체 변환 -----
function tokenToRule(token: string): FilterRule | undefined {
  if (!token || token === "ALL") return undefined;

  if (/^-\s*-?\d+(\.\d+)?$/.test(token)) {
    const max = parseFloat(token.slice(1));
    return { kind: "range", max };
  }
  if (/^-?\d+(\.\d+)?-\s*$/.test(token)) {
    const min = parseFloat(token.slice(0, -1));
    return { kind: "range", min };
  }
  if (/^-?\d+(\.\d+)?\s*-\s*-?\d+(\.\d+)?$/.test(token)) {
    const [minStr, maxStr] = token.split("-").map((s) => s.trim());
    return { kind: "range", min: parseFloat(minStr), max: parseFloat(maxStr) };
  }
  return undefined;
}

function ruleToToken(rule?: FilterRule): string {
  if (!rule) return "ALL";
  switch (rule.kind) {
    case "num": {
      const { op, value } = rule;
      if (op === "<" || op === "<=") return `-${value}`;
      if (op === ">" || op === ">=") return `${value}-`;
      return "ALL"; // ==, != 는 현재 토큰 세트에 없음
    }
    case "range": {
      const { min, max } = rule;
      if (min != null && max != null) return `${min}-${max}`;
      if (min != null) return `${min}-`;
      if (max != null) return `-${max}`;
      return "ALL";
    }
    case "enum": {
      return rule.equals ?? "ALL";
    }
    default: {
      return "ALL";
    }
  }
}

export default function FundamentalFilter({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-4 mb-4 text-sm text-white">
      {Object.entries(OPTIONS).map(([field, options]) => {
        const key = field as FilterKey;
        const selectedToken = ruleToToken(filters[key]);
        return (
          <div key={field} className="flex flex-col w-56">
            <label
              className="mb-1 font-semibold text-xs text-gray-300 truncate"
              title={FIELD_NAMES[field] ?? field}
            >
              {FIELD_NAMES[field] ?? field}
            </label>
            <select
              value={selectedToken}
              onChange={(e) => onChange(key, tokenToRule(e.target.value))}
              className="bg-[#2A2A40] text-white border border-[#444] rounded-md px-2 py-1 text-sm w-full"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {LABELS[opt] ?? opt}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}
