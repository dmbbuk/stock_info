// src/pages/FundamentalSettings.tsx

type Props = {
  enabledMetrics: string[];
  onChange: (metrics: string[]) => void;
};

const AVAILABLE_METRICS = [
  { key: "PER", label: "PER" },
  { key: "EPS", label: "EPS" },
  { key: "PBR", label: "PBR" },
  { key: "marketCap", label: "시가총액" },
  { key: "dividendYield", label: "배당수익률" },
];

export default function FundamentalSettings({
  enabledMetrics,
  onChange,
}: Props) {
  const toggleMetric = (key: string) => {
    if (enabledMetrics.includes(key)) {
      onChange(enabledMetrics.filter((m) => m !== key));
    } else {
      onChange([...enabledMetrics, key]);
    }
  };

  return (
    <div className="mb-4 flex flex-wrap gap-4">
      {AVAILABLE_METRICS.map(({ key, label }) => (
        <label key={key} className="flex items-center gap-2 text-white">
          <input
            type="checkbox"
            checked={enabledMetrics.includes(key)}
            onChange={() => toggleMetric(key)}
            className="accent-blue-500"
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
}
