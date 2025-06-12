type Props = {
  filters: {
    per: string;
    eps: string;
    pbr: string;
    dividend: string;
  };
  onChange: (field: keyof Props["filters"], value: string) => void;
};

// ① 문장형 한글 라벨 정의
const FILTER_LABELS: Record<string, string> = {
  ALL: "전체",
  "<10": "10 미만",
  "10-20": "10 이상 20 미만",
  "20-40": "20 이상 40 미만",
  "≥40": "40 이상",
  "<1": "1 미만",
  "1-5": "1 이상 5 미만",
  "≥5": "5 이상",
  "1-3": "1 이상 3 미만",
  "≥3": "3 이상",
};

const FILTER_OPTIONS = {
  per: ["ALL", "<10", "10-20", "20-40", "≥40"],
  eps: ["ALL", "<1", "1-5", "≥5"],
  pbr: ["ALL", "<1", "1-3", "≥3"],
  dividend: ["ALL", "<1", "1-3", "≥3"],
};

export default function FundamentalFilter({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-4 mb-4 text-sm text-white">
      {Object.entries(FILTER_OPTIONS).map(([field, options]) => (
        <div key={field} className="flex flex-col">
          <label className="mb-1 font-semibold uppercase">{field}</label>
          <select
            value={filters[field as keyof Props["filters"]]}
            onChange={(e) =>
              onChange(field as keyof Props["filters"], e.target.value)
            }
            className="bg-[#2A2A40] text-white border border-[#444] rounded-md px-2 py-1 text-sm"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {FILTER_LABELS[opt]}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
