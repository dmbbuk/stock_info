import type { FilterKey } from "shared-types/src/filterSetTypes";
import type { FilterRule } from "@/utils/filterEngine";
import { FILTER_TOOLTIPS } from "@/constants/tooltipStrings";
import { useState } from "react";

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
  Technology: "기술 (Technology)",
  earningsYield: "이익수익률 (EY)",
  returnOnCapital: "자본수익률 (ROC)",
  // Technicals
  Week52High: "52주 최고가 (근접)", // 현재가가 최고가 대비 어느 정도인지
  Week52Low: "52주 최저가 (근접)", // 현재가가 최저가 대비 어느 정도인지
  Day50MA: "50일 이평선 (추세)", // 현재가가 50일선 위/아래
  Day200MA: "200일 이평선 (장기추세)",
};

// ----- 필드명 라벨 (한글 매핑) -----
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
  epsGrowth: "EPS 성장률",
};

const OPTIONS: Record<string, string[]> = {
  // --- 1. Basic Filters ---
  sector: ["ALL", "Technology"], // TODO: 전체 섹터 리스트 필요
  marketCap: [
    "ALL",
    "mega", // 200B+
    "large", // 10B - 200B
    "mid", // 2B - 10B
    "small", // 300M - 2B
    "micro", // < 300M
  ],
  PER: ["ALL", "-10", "-15", "-20", "-25", "10-20", "20-40", "-40", "40-"],
  dividendYield: ["ALL", "1-", "3-", "5-"],
  roe: ["ALL", "10-", "15-", "20-"],

  // --- 2. Advanced Filters ---
  revenueGrowth: ["ALL", "0.1-", "0.2-", "0.3-"],
  operatingMargin: ["ALL", "10-", "20-", "30-"],
  PBR: ["ALL", "-1", "1-3", "3-"],
  PEG: ["ALL", "-1", "1-", "1-1.5"],
  evEbitda: ["ALL", "-10", "10-20", "20-"],

  // 아래는 사용 안 함 (설정만 유지) - 화면에 렌더링 안 됨
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
  volume: ["ALL", "100000-", "1000000-"],
  earningsYield: ["ALL"],
  returnOnCapital: ["ALL"],
};

// ----- 토큰 ↔ 규칙 객체 변환 -----
function tokenToRule(token: string): FilterRule | undefined {
  if (!token || token === "ALL") return undefined;

  // Market Cap Presets (1B = 1,000,000,000)
  if (token === "mega") return { kind: "range", min: 200_000_000_000 };
  if (token === "large")
    return { kind: "range", min: 10_000_000_000, max: 200_000_000_000 };
  if (token === "mid")
    return { kind: "range", min: 2_000_000_000, max: 10_000_000_000 };
  if (token === "small")
    return { kind: "range", min: 300_000_000, max: 2_000_000_000 };
  if (token === "micro") return { kind: "range", max: 300_000_000 };

  // 1) 숫자 범위(Range) 패턴인지 먼저 확인
  //    (주의: "Technology" 같은 문자열이 오면 parseFloat가 NaN이 나올 수 있음 등으로
  //     정규식 체크가 필수)

  const isMaxPattern = /^-\s*-?\d+(\.\d+)?$/; // "-10"  (= 10미만)
  const isMinPattern = /^-?\d+(\.\d+)?-\s*$/; // "10-"  (= 10이상)
  const isRangePattern = /^-?\d+(\.\d+)?\s*-\s*-?\d+(\.\d+)?$/; // "10-20" (= 10~20)

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

  // 2) 위 숫자 패턴에 안 걸리면, 문자열 일치(enum)로 간주
  //    (예: "Technology", "Healthcare" 등)
  return { kind: "enum", equals: token };
}

// Market Cap 역변환 로직 (간단히 매칭)
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

export default function FundamentalFilter({ filters, onChange }: Props) {
  // 모바일/클릭 환경 대응을 위한 툴팁 상태 관리
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // 그룹별 렌더링 함수
  const renderFilters = (keys: FilterKey[]) => (
    <div className="flex flex-wrap gap-4">
      {keys.map((field) => {
        const options = OPTIONS[field];
        const selectedToken = ruleToToken(filters[field]);
        const hasTooltip = !!FILTER_TOOLTIPS[field];

        return (
          <div key={field} className="flex flex-col w-40 relative">
            <div className="flex items-center mb-1 gap-1">
              <label className="font-semibold text-xs text-gray-400 truncate cursor-default">
                {FIELD_NAMES[field] ?? field}
              </label>
              {/* 물음표 아이콘 (툴팁이 있는 경우만) */}
              {hasTooltip && (
                <button
                  type="button"
                  className="text-[10px] w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-400 transition-colors"
                  onClick={() =>
                    setActiveTooltip(activeTooltip === field ? null : field)
                  }
                >
                  ?
                </button>
              )}
            </div>

            {/* 툴팁 팝업 Layer (absolute) */}
            {activeTooltip === field && (
              <>
                {/* 외부 클릭 시 닫기 위한 투명 오버레이 */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setActiveTooltip(null)}
                />
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
      })}
    </div>
  );

  return (
    <div className="mb-6 p-4 bg-[#181825] rounded-lg border border-gray-700 shadow-sm flex flex-col gap-6">
      {/* 1. 기본 필터 섹션 */}
      <div className="border-b border-gray-700 pb-4">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-500 rounded-sm"></span>
          기본 필터 (Essential)
        </h4>
        {renderFilters([
          "marketCap",
          "PER",
          "PBR",
          "dividendYield",
          "roe",
          "operatingMargin",
          "profitMargin",
          "sector",
        ])}
      </div>

      {/* 2. 고급 필터 섹션 */}
      <div>
        <h4 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-gray-500 rounded-sm"></span>
          성장성 & 가치 (Advanced)
        </h4>
        {renderFilters([
          "PEG",
          "revenueGrowth",
          "epsGrowth",
          "earningsYield",
          "returnOnCapital",
          "evEbitda",
        ])}
      </div>
    </div>
  );
}
