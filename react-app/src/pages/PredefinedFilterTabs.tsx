// PredefinedFilterTabs.tsx
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import { PRESET_DESCRIPTIONS } from "@/constants/tooltipStrings";
import type { FilterSet } from "@/utils/filterEngine";

type Props = {
  onApplyFilter: (filters: FilterSet, label: string) => void;
  activePreset: string | null;
};

const predefined: {
  label: string;
  filters: FilterSet;
  descriptionKey?: string;
}[] = [
  {
    label: "워렌 버핏 가치주",
    descriptionKey: "워렌 버핏 가치주",
    filters: {
      PER: { kind: "num", op: "<", value: 25 }, // 20 -> 25 완화
      roe: { kind: "num", op: ">=", value: 15 },
      operatingMargin: { kind: "num", op: ">=", value: 10 }, // 영업이익률 추가 (해자)
      profitMargin: { kind: "num", op: ">=", value: 10 }, // 순이익률 추가
      // 배당 조건은 필수는 아니므로 완화 혹은 제거 (버크셔는 배당 안 줌)
    },
  },
  {
    label: "피터 린치 성장주",
    descriptionKey: "피터 린치 성장주",
    filters: {
      PEG: { kind: "num", op: "<=", value: 1 },
      epsGrowth: { kind: "num", op: ">=", value: 0.15 },
      revenueGrowth: { kind: "num", op: ">=", value: 0.15 }, // 0.1 -> 0.15 상향 조정
      PER: { kind: "num", op: "<", value: 25 },
    },
  },
  {
    label: "벤저민 그레이엄 저PER",
    descriptionKey: "벤저민 그레이엄 저PER",
    filters: {
      PER: { kind: "num", op: "<", value: 15 },
      PBR: { kind: "range", max: 1.5 },
    },
  },
  {
    label: "그린블라트 마법공식",
    descriptionKey: "그린블라트 마법공식",
    filters: {
      returnOnCapital: { kind: "num", op: ">=", value: 0.3 }, // 0.5 -> 0.3 현실화
      earningsYield: { kind: "num", op: ">=", value: 0.1 },
    },
  },
  {
    label: "고배당 안정주",
    descriptionKey: "고배당 안정주",
    filters: {
      dividendYield: { kind: "num", op: ">=", value: 3 },
      payoutRatio: { kind: "num", op: "<", value: 0.6 },
      PER: { kind: "num", op: "<", value: 20 },
    },
  },
  {
    label: "저PBR 자산주",
    filters: {
      PBR: { kind: "num", op: "<", value: 1 },
      PER: { kind: "num", op: "<", value: 15 },
    },
  },
  {
    label: "실적 성장주",
    filters: {
      epsGrowth: { kind: "num", op: ">=", value: 0.15 },
      revenueGrowth: { kind: "num", op: ">=", value: 0.1 },
      PER: { kind: "num", op: "<", value: 40 },
    },
  },
  {
    label: "기술주 필터",
    filters: {
      sector: { kind: "enum", equals: "Technology" },
      PER: { kind: "num", op: "<", value: 40 },
    },
  },
  { label: "급등주", filters: {} },
];

const PredefinedFilterTabs = ({ onApplyFilter, activePreset }: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      {predefined.map((preset) => {
        const isActive = activePreset === preset.label;
        const description = preset.descriptionKey
          ? PRESET_DESCRIPTIONS[preset.descriptionKey]
          : undefined;

        return (
          <div key={preset.label}>
            {description ? (
              <SimpleTooltip content={description}>
                <button
                  type="button"
                  onClick={() =>
                    onApplyFilter({ ...preset.filters }, preset.label)
                  }
                  className={`text-sm px-3 py-1 rounded transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white font-medium hover:bg-blue-500"
                      : "bg-[#3B3B50] text-[#e0e0e0] hover:bg-[#4F4F70]"
                  }`}
                  aria-label={`필터 적용: ${preset.label}`}
                  aria-pressed={isActive}
                >
                  {preset.label}
                </button>
              </SimpleTooltip>
            ) : (
              <button
                type="button"
                onClick={() =>
                  onApplyFilter({ ...preset.filters }, preset.label)
                }
                className={`text-sm px-3 py-1 rounded transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white font-medium hover:bg-blue-500"
                    : "bg-[#3B3B50] text-[#e0e0e0] hover:bg-[#4F4F70]"
                }`}
                aria-label={`필터 적용: ${preset.label}`}
                aria-pressed={isActive}
              >
                {preset.label}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PredefinedFilterTabs;
