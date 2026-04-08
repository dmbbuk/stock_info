import type { FilterKey } from "shared-types/src/filterSetTypes";
import type { FilterRule } from "@/utils/filterEngine";
import { FILTER_TOOLTIPS } from "@/constants/tooltipStrings";
import { useState } from "react";

type Props = {
  filters: Partial<Record<FilterKey, FilterRule | undefined>>;
  onChange: (field: FilterKey, rule?: FilterRule) => void;
  /** Finviz 스타일 인라인 필터 그리드 모드 */
  compact?: boolean;
};

// ----- 라벨(표시 텍스트) -----
const LABELS: Record<string, string> = {
  ALL: "Any",
  "-0": "< 0",
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
  "0.3-": "0.3+",
  "0.5-1": "0.5~1",
  "1-": "1+",
  "5-": "5+",
  "10-": "10+",
  "15-": "15+",
  "20-": "20+",
  "40-": "40+",
  "100-": "100+",
  "300-": "300+",
  "100000-": "100K+",
  "1000000-": "1M+",
  "10000000-": "10M+",
  "100000000-": "100M+",
  "1000000000-": "1B+",
  "5000000000-": "5B+",
  "10000000000-": "10B+",
  "20000000000-": "20B+",
  "-1": "< 1",
  "-3": "< 3",
  "-5": "< 5",
  "-10": "< 10",
  "-15": "< 15",
  "-20": "< 20",
  "-25": "< 25",
  "-40": "< 40",
  "-50": "< 50",
  "-100": "< 100",
  "-300": "< 300",
  "-0.6": "< 0.6",
  "-1.5": "< 1.5",
  "3-": "3+",
  "0.1-": "10%+",
  "0.15-": "15%+",
  "0.2-": "20%+",
  Technology: "Technology",
  mega: "Mega (200B+)",
  large: "Large (10B~200B)",
  mid: "Mid (2B~10B)",
  small: "Small (300M~2B)",
  micro: "Micro (<300M)",
};

// ----- 필드명 라벨 (패널 모드용 한글) -----
const FIELD_NAMES: Record<string, string> = {
  PER: "PER (주가수익비율)",
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
  EBITDA: "EBITDA",
  WallStreetTargetPrice: "월가 목표가",
  BookValue: "주당순자산 (BPS)",
  DividendShare: "주당배당금",
  EPSEstimateCurrentYear: "올해 EPS 예상",
  EPSEstimateNextYear: "내년 EPS 예상",
  EPSEstimateNextQuarter: "다음분기 EPS 예상",
  EPSEstimateCurrentQuarter: "이번분기 EPS 예상",
  ReturnOnAssetsTTM: "ROA (총자산이익률)",
  RevenueTTM: "매출 (최근 12개월)",
  RevenuePerShareTTM: "주당매출 (SPS)",
  QuarterlyRevenueGrowthYOY: "매출성장률 (전년동기)",
  GrossProfitTTM: "매출총이익",
  QuarterlyEarningsGrowthYOY: "이익성장률 (전년동기)",
  volume: "거래량",
  earningsYield: "이익수익률 (마법공식)",
  returnOnCapital: "자본수익률 (마법공식)",
  marketCap: "시가총액",
  sector: "섹터",
};

// ----- compact 모드용 짧은 라벨 -----
const COMPACT_LABELS: Record<string, string> = {
  marketCap: "Market Cap",
  sector: "Sector",
  PER: "P/E",
  PBR: "P/B",
  dividendYield: "Dividend",
  roe: "ROE",
  operatingMargin: "Op. Margin",
  profitMargin: "Net Margin",
  PEG: "PEG",
  revenueGrowth: "Rev. Growth",
  evEbitda: "EV/EBITDA",
  volume: "Volume",
};

const OPTIONS: Record<string, string[]> = {
  sector: ["ALL", "Technology"],
  marketCap: ["ALL", "mega", "large", "mid", "small", "micro"],
  PER: ["ALL", "-10", "-15", "-20", "-25", "10-20", "20-40", "-40", "40-"],
  dividendYield: ["ALL", "1-", "3-", "5-"],
  roe: ["ALL", "10-", "15-", "20-"],
  revenueGrowth: ["ALL", "0.1-", "0.2-", "0.3-"],
  operatingMargin: ["ALL", "10-", "20-", "30-"],
  PBR: ["ALL", "-1", "1-3", "3-"],
  PEG: ["ALL", "-1", "1-", "1-1.5"],
  evEbitda: ["ALL", "-10", "10-20", "20-"],
  volume: ["ALL", "100000-", "1000000-"],
  // 아래는 화면에 렌더링 안 됨 (설정만 유지)
  EPS: ["ALL"],
  payoutRatio: ["ALL"],
  epsGrowth: ["ALL"],
  profitMargin: ["ALL"],
  evEbit: ["ALL"],
  EBITDA: ["ALL"],
  WallStreetTargetPrice: ["ALL"],
  BookValue: ["ALL"],
  DividendShare: ["ALL"],
  EPSEstimateCurrentYear: ["ALL"],
  EPSEstimateNextYear: ["ALL"],
  EPSEstimateNextQuarter: ["ALL"],
  EPSEstimateCurrentQuarter: ["ALL"],
  ReturnOnAssetsTTM: ["ALL"],
  RevenueTTM: ["ALL"],
  RevenuePerShareTTM: ["ALL"],
  QuarterlyRevenueGrowthYOY: ["ALL"],
  GrossProfitTTM: ["ALL"],
  QuarterlyEarningsGrowthYOY: ["ALL"],
  earningsYield: ["ALL"],
  returnOnCapital: ["ALL"],
};

// compact 모드에서 표시할 필드 (옵션이 있는 것만)
const COMPACT_FILTER_KEYS: FilterKey[] = [
  "marketCap", "sector", "PER", "PBR", "dividendYield",
  "roe", "operatingMargin", "profitMargin", "PEG", "revenueGrowth", "evEbitda", "volume",
];

// ----- 토큰 ↔ 규칙 객체 변환 -----
function tokenToRule(token: string): FilterRule | undefined {
  if (!token || token === "ALL") return undefined;

  if (token === "mega") return { kind: "range", min: 200_000_000_000 };
  if (token === "large") return { kind: "range", min: 10_000_000_000, max: 200_000_000_000 };
  if (token === "mid") return { kind: "range", min: 2_000_000_000, max: 10_000_000_000 };
  if (token === "small") return { kind: "range", min: 300_000_000, max: 2_000_000_000 };
  if (token === "micro") return { kind: "range", max: 300_000_000 };

  const isMaxPattern = /^-\s*-?\d+(\.\d+)?$/;
  const isMinPattern = /^-?\d+(\.\d+)?-\s*$/;
  const isRangePattern = /^-?\d+(\.\d+)?\s*-\s*-?\d+(\.\d+)?$/;

  if (isMaxPattern.test(token)) {
    const max = parseFloat(token.slice(1));
    return { kind: "range", max };
  }
  if (isMinPattern.test(token)) {
    const min = parseFloat(token.slice(0, -1));
    return { kind: "range", min };
  }
  if (isRangePattern.test(token)) {
    const [minStr, maxStr] = token.split("-").map((s) => s.trim());
    return { kind: "range", min: parseFloat(minStr), max: parseFloat(maxStr) };
  }

  return { kind: "enum", equals: token };
}

function ruleToToken(rule?: FilterRule): string {
  if (!rule) return "ALL";
  if (rule.kind === "range") {
    const { min, max } = rule;
    if (min === 200_000_000_000) return "mega";
    if (min === 10_000_000_000 && max === 200_000_000_000) return "large";
    if (min === 2_000_000_000 && max === 10_000_000_000) return "mid";
    if (min === 300_000_000 && max === 2_000_000_000) return "small";
    if (max === 300_000_000) return "micro";
  }

  switch (rule.kind) {
    case "num": {
      const { op, value } = rule;
      if (op === "<" || op === "<=") return `-${value}`;
      if (op === ">" || op === ">=") return `${value}-`;
      return "ALL";
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

export default function FundamentalFilter({ filters, onChange, compact = false }: Props) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // 단일 필드 렌더링 (두 모드 공용)
  const renderItem = (field: FilterKey) => {
    const options = OPTIONS[field];
    if (!options) return null;
    const selectedToken = ruleToToken(filters[field]);
    const isActive = selectedToken !== "ALL";
    const hasTooltip = !!FILTER_TOOLTIPS[field];

    if (compact) {
      return (
        <div key={field} className="flex flex-col">
          <label className="text-[10px] text-gray-500 mb-0.5 whitespace-nowrap">
            {COMPACT_LABELS[field] ?? field}
          </label>
          <select
            value={selectedToken}
            onChange={(e) => onChange(field, tokenToRule(e.target.value))}
            className={`bg-[#1a1a1a] border rounded px-2 py-0.5 text-xs cursor-pointer transition-colors focus:outline-none min-w-[100px] ${
              isActive
                ? "border-blue-500 text-blue-300"
                : "border-[#2a2a2a] text-gray-300 hover:border-[#444]"
            }`}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {LABELS[opt] ?? opt}
              </option>
            ))}
          </select>
        </div>
      );
    }

    // Panel 모드 (기존 스타일 유지)
    return (
      <div key={field} className="flex flex-col w-40 relative">
        <div className="flex items-center mb-1 gap-1">
          <label className="font-semibold text-xs text-gray-400 truncate cursor-default">
            {FIELD_NAMES[field] ?? field}
          </label>
          {hasTooltip && (
            <button
              type="button"
              className="text-[10px] w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-400 transition-colors"
              onClick={() => setActiveTooltip(activeTooltip === field ? null : field)}
            >
              ?
            </button>
          )}
        </div>
        {activeTooltip === field && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setActiveTooltip(null)} />
            <div className="absolute z-20 top-full left-0 mt-2 w-64 p-3 bg-gray-900 border border-gray-600 text-xs text-gray-200 rounded shadow-xl whitespace-pre-wrap leading-relaxed">
              {FILTER_TOOLTIPS[field]}
              <div className="absolute bottom-full left-4 -mb-[1px] border-8 border-transparent border-b-gray-600" />
            </div>
          </>
        )}
        <select
          value={selectedToken}
          onChange={(e) => onChange(field, tokenToRule(e.target.value))}
          className="bg-[#1E1E2E] text-gray-200 border border-gray-600 rounded-md px-3 py-1.5 text-sm w-full hover:border-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {LABELS[opt] ?? opt}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // ----- Compact 모드 (Finviz 인라인 필터 그리드) -----
  if (compact) {
    return (
      <div className="px-3 py-2 flex flex-wrap gap-x-4 gap-y-2">
        {COMPACT_FILTER_KEYS.map((field) => renderItem(field))}
      </div>
    );
  }

  // ----- Panel 모드 (기존 그룹별 렌더링) -----
  const renderGroup = (keys: FilterKey[]) => (
    <div className="flex flex-wrap gap-4">
      {keys.map((field) => renderItem(field))}
    </div>
  );

  return (
    <div className="mb-6 p-4 bg-[#181825] rounded-lg border border-gray-700 shadow-sm flex flex-col gap-6">
      <div className="border-b border-gray-700 pb-4">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-500 rounded-sm"></span>
          기본 필터 (Essential)
        </h4>
        {renderGroup(["marketCap", "PER", "PBR", "dividendYield", "roe", "operatingMargin", "profitMargin", "sector"])}
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-gray-500 rounded-sm"></span>
          성장성 & 가치 (Advanced)
        </h4>
        {renderGroup(["PEG", "revenueGrowth", "epsGrowth", "earningsYield", "returnOnCapital", "evEbitda"])}
      </div>
    </div>
  );
}
