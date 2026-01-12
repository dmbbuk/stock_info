// PredefinedFilterTabs.tsx
import type { FilterSet } from "@/utils/filterEngine";

type Props = {
  onApplyFilter: (filters: FilterSet, label: string) => void;
};

const predefined: { label: string; filters: FilterSet }[] = [
  {
    label: "📉 워렌 버핏 가치주",
    filters: {
      PER: { kind: "num", op: "<", value: 20 },
      roe: { kind: "num", op: ">=", value: 15 },
      dividendYield: { kind: "num", op: ">=", value: 1 },
      payoutRatio: { kind: "num", op: "<", value: 1 },
    },
  },
  {
    label: "📈 피터 린치 성장주",
    filters: {
      PEG: { kind: "num", op: "<=", value: 1 },
      epsGrowth: { kind: "num", op: ">=", value: 0.15 },
      revenueGrowth: { kind: "num", op: ">=", value: 0.1 },
      PER: { kind: "num", op: "<", value: 25 },
    },
  },
  {
    label: "📚 벤저민 그레이엄 저PER",
    filters: {
      PER: { kind: "num", op: "<", value: 15 },
      PBR: { kind: "range", max: 1.5 },
    },
  },
  {
    label: "🔮 그린블라트 마법공식",
    filters: {
      returnOnCapital: { kind: "num", op: ">=", value: 0.5 }, // ROC 50% 이상 (충분히 높은 자본 효율)
      earningsYield: { kind: "num", op: ">=", value: 0.1 }, // 이익 수익률 10% 이상 (저평가)
    },
  },
  {
    label: "🏦 고배당 안정주",
    filters: {
      dividendYield: { kind: "num", op: ">=", value: 3 },
      payoutRatio: { kind: "num", op: "<", value: 0.6 },
      PER: { kind: "num", op: "<", value: 20 },
    },
  },
  {
    label: "📊 저PBR 자산주",
    filters: {
      PBR: { kind: "num", op: "<", value: 1 },
      PER: { kind: "num", op: "<", value: 15 },
    },
  },
  {
    label: "🚀 실적 성장주",
    filters: {
      epsGrowth: { kind: "num", op: ">=", value: 0.15 },
      revenueGrowth: { kind: "num", op: ">=", value: 0.1 },
      PER: { kind: "num", op: "<", value: 40 },
    },
  },
  {
    label: "🧪 기술주 필터",
    filters: {
      sector: { kind: "enum", equals: "Technology" },
      PER: { kind: "num", op: "<", value: 40 },
    },
  },
  { label: "🔥 급등주", filters: {} },
];

const PredefinedFilterTabs = ({ onApplyFilter }: Props) => {
  return (
    <div className="flex flex-wrap gap-2 my-4">
      {predefined.map(({ label, filters }) => (
        <button
          key={label}
          type="button"
          onClick={() => onApplyFilter({ ...filters }, label)}
          className="bg-[#3B3B50] hover:bg-[#4F4F70] text-white text-sm px-3 py-1 rounded"
          aria-label={`필터 적용: ${label}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default PredefinedFilterTabs;
