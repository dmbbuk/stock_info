// shared-utils/filterEngine.ts
export type NumOp = "<" | "<=" | ">" | ">=" | "==" | "!=";

export type NumericRule =
  | { kind: "num"; op: NumOp; value: number }
  | { kind: "range"; min?: number; max?: number };

export type EnumRule = { kind: "enum"; equals: string };

export type FilterRule = NumericRule | EnumRule;

// 필드 메타: 숫자/문자, 단위 제거 패턴, 스케일링 등
export type FieldMeta =
  | { type: "number"; strip?: RegExp; scale?: number }
  | { type: "enum" };

// 프로젝트에서 쓰는 실제 필드 키만 등록하면 됨
export const FIELD_META: Record<string, FieldMeta> = {
  PER: { type: "number" },
  EPS: { type: "number" },
  PBR: { type: "number" },
  dividendYield: { type: "number", strip: /[%\s]/g }, // "3%" → 3
  PEG: { type: "number" },
  payoutRatio: { type: "number" },
  roe: { type: "number" },
  epsGrowth: { type: "number" },
  revenueGrowth: { type: "number" },
  evEbitda: { type: "number" },
  operatingMargin: { type: "number" },
  profitMargin: { type: "number" },
  evEbit: { type: "number" },
  EBITDA: { type: "number" },
  WallStreetTargetPrice: { type: "number" },
  BookValue: { type: "number" },
  DividendShare: { type: "number" },
  EPSEstimateCurrentYear: { type: "number" },
  EPSEstimateNextYear: { type: "number" },
  EPSEstimateNextQuarter: { type: "number" },
  EPSEstimateCurrentQuarter: { type: "number" },
  ReturnOnAssetsTTM: { type: "number" },
  RevenueTTM: { type: "number" },
  RevenuePerShareTTM: { type: "number" },
  QuarterlyRevenueGrowthYOY: { type: "number" },
  GrossProfitTTM: { type: "number" },
  QuarterlyEarningsGrowthYOY: { type: "number" },
  marketCap: { type: "number" },
  volume: { type: "number" },

  // 필요시 추가
  sector: { type: "enum" },
  // name, ticker 등은 보통 필터 안함
};

function toNumber(raw: unknown, meta?: FieldMeta): number {
  if (!meta || meta.type !== "number") return NaN;
  if (typeof raw === "number") return raw;
  if (typeof raw === "string") {
    const cleaned = (meta.strip ? raw.replace(meta.strip, "") : raw).replace(
      /,/g,
      ""
    );
    const n = parseFloat(cleaned);
    return Number.isNaN(n) ? NaN : meta.scale ? n * meta.scale : n;
  }
  return NaN;
}

export function testRule(lhs: unknown, key: string, rule: FilterRule): boolean {
  const meta = FIELD_META[key];
  if (!meta) return true; // 등록 안 된 필드는 건너뜀(원하면 false로)

  if (rule.kind === "enum") {
    return (
      meta.type === "enum" && typeof lhs === "string" && lhs === rule.equals
    );
  }

  const val = toNumber(lhs, meta);
  if (Number.isNaN(val)) return false;

  if (rule.kind === "num") {
    const { op, value } = rule;
    switch (op) {
      case "<":
        return val < value;
      case "<=":
        return val <= value;
      case ">":
        return val > value;
      case ">=":
        return val >= value;
      case "==":
        return val === value;
      case "!=":
        return val !== value;
    }
  } else {
    // range
    if (rule.min != null && val < rule.min) return false;
    if (rule.max != null && val > rule.max) return false;
    return true;
  }
}

export type FilterSet = Partial<Record<string, FilterRule>>;

export function applyFilters(
  row: Record<string, unknown>,
  filters: FilterSet
): boolean {
  for (const [field, rule] of Object.entries(filters)) {
    if (!rule) continue;
    if (!testRule(row[field], field, rule)) return false;
  }
  return true;
}
