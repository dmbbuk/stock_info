// src/pages/FundamentalSettings.tsx
import { FIXED_COLUMN_ORDER } from "@/components/StockTableColumns";

type Props = {
  enabledMetrics: string[];
  onChange: (metrics: string[]) => void;
};

// 그룹 정의
const METRIC_GROUPS = [
  {
    title: "필수 지표 (Essential)",
    items: [
      { key: "marketCap", label: "시가총액" },
      { key: "PER", label: "PER" },
      { key: "roe", label: "ROE" },
      { key: "dividendYield", label: "배당수익률" },
    ],
  },
  {
    title: "성장성 & 수익성 (Growth & Profitability)",
    items: [
      { key: "revenueGrowth", label: "매출성장률" },
      { key: "epsGrowth", label: "EPS성장률" },
      { key: "operatingMargin", label: "영업이익률" },
      { key: "profitMargin", label: "순이익률" },
    ],
  },
  {
    title: "세부 심화 지표 (Deep Dive)",
    items: [
      { key: "PBR", label: "PBR" },
      { key: "evEbitda", label: "EV/EBITDA" },
      { key: "PEG", label: "PEG" },
      { key: "EPS", label: "EPS" },
      { key: "volume", label: "거래량" },
    ],
  },
  {
    title: "기술적 지표 (Technical Analysis)",
    items: [
      { key: "Week52High", label: "52주 최고가 대비" },
      { key: "Week52Low", label: "52주 최저가 대비" },
      { key: "Day200MA", label: "추세 (200일선)" },
    ],
  },
];

export default function FundamentalSettings({
  enabledMetrics,
  onChange,
}: Props) {
  const toggleMetric = (key: string) => {
    // 1) 이미 활성화되어 있으면 제거
    if (enabledMetrics.includes(key)) {
      onChange(enabledMetrics.filter((m) => m !== key));
    }
    // 2) 아니면 추가
    else {
      // 순서를 유지하기 위해 AVAILABLE_METRICS 대신 FIXED_COLUMN_ORDER 사용
      const newMetrics = [...enabledMetrics, key];

      // 고정된 순서대로 정렬해서 저장
      newMetrics.sort(
        (a, b) => FIXED_COLUMN_ORDER.indexOf(a) - FIXED_COLUMN_ORDER.indexOf(b)
      );

      onChange(newMetrics);
    }
  };

  return (
    <div className="mb-4 flex flex-col gap-4 p-4 bg-gray-900 rounded-lg">
      {METRIC_GROUPS.map((group) => (
        <div key={group.title} className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-gray-400 border-b border-gray-700 pb-1">
            {group.title}
          </h4>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {group.items.map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2 text-white cursor-pointer hover:text-blue-200 transition-colors"
                title={label}
              >
                <input
                  type="checkbox"
                  checked={enabledMetrics.includes(key)}
                  onChange={() => toggleMetric(key)}
                  className="accent-blue-500 w-4 h-4"
                />
                <span className="text-sm font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
