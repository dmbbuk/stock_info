import React from "react";
import type { FilterSetTypes } from "shared-types/src/filterSetTypes";

type FilterSet = Partial<FilterSetTypes>;

type Props = {
  onApplyFilter: (filters: FilterSet) => void;
};

const predefinedFilters: { label: string; filters: FilterSet }[] = [
  {
    label: "📉 워렌 버핏 가치주",
    // 저PER(20이하), ROE 15% 이상, 배당(1% 이상), 부채비율 100% 이하(생략 가능)
    filters: {
      PER: "<20",
      roe: ">=15",
      dividendYield: ">=1",
      payoutRatio: "<1", // 너무 과도하지 않은 배당
      // debtToEquity: "<1", // 별도 추가 가능
    },
  },
  {
    label: "📈 피터 린치 성장주",
    // PEG 1 이하, EPS/매출 성장, PER 25 이하
    filters: {
      PEG: "<=1",
      epsGrowth: ">=0.15", // 연간 15% 이상 성장
      revenueGrowth: ">=0.10", // 매출도 성장
      PER: "<25",
    },
  },
  {
    label: "📚 벤저민 그레이엄 저PER",
    // PER 15 이하, PBR 1.5 이하, 부채비율 낮음
    filters: {
      PER: "<15",
      PBR: "<1.5",
      // debtToEquity: "<0.5", // 필요 시 사용
    },
  },
  {
    label: "🔮 그린블라트 마법공식",
    // ROE 15% 이상, PER 20 이하
    filters: {
      PER: "<20",
      roe: ">=15",
    },
  },
  {
    label: "🏦 고배당 안정주",
    // 배당 3% 이상, PER 20 이하, 배당성향 60% 이하
    filters: {
      dividendYield: ">=3",
      payoutRatio: "<0.6",
      PER: "<20",
    },
  },
  {
    label: "📊 저PBR 자산주",
    // PBR 1 미만, PER 15 이하
    filters: {
      PBR: "<1",
      PER: "<15",
    },
  },
  {
    label: "🚀 실적 성장주",
    // EPS/매출 성장, PER 40 이하
    filters: {
      epsGrowth: ">=0.15",
      revenueGrowth: ">=0.10",
      PER: "<40",
    },
  },
  {
    label: "🧪 기술주 필터",
    // 섹터가 기술주, PER 40 이하
    filters: {
      sector: "Technology",
      PER: "<40",
    },
  },
  {
    label: "🔥 급등주",
    // 가격상승률 별도 구현 필요 (예: 5일/1일 전일대비 10% 이상)
    filters: {},
  },
];

const PredefinedFilterTabs = ({ onApplyFilter }: Props) => {
  return (
    <div className="flex flex-wrap gap-2 my-4">
      {predefinedFilters.map(({ label, filters }) => (
        <button
          key={label}
          onClick={() => onApplyFilter(filters)}
          className="bg-[#3B3B50] hover:bg-[#4F4F70] text-white text-sm px-3 py-1 rounded"
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default PredefinedFilterTabs;
