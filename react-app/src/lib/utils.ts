import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumberOrDash(
  val?: number | string | null,
  digits = 2,
  suffix = ""
) {
  if (val == null || val === "") return "-";

  // 이미 문자열인데 숫자가 아닌 경우 (예: "30.5%" 이런게 넘어올 수도 있음)를 대비
  const num = typeof val === "string" ? parseFloat(val.replace(/,/g, "")) : val;
  if (isNaN(num)) return val.toString();

  return num.toFixed(digits) + suffix;
}
