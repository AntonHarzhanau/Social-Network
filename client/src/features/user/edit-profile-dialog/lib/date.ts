export function splitIso(iso?: string | null) {
  if (!iso) return { y: "", m: "", d: "" };
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return { y: "", m: "", d: "" };
  return { y: m[1], m: String(Number(m[2])), d: String(Number(m[3])) };
}

export function toIso(y: string, m: string, d: string) {
  if (!y || !m || !d) return "";
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

export const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
] as const;

export function days() {
  return Array.from({ length: 31 }, (_, i) => String(i + 1));
}

export function years(from = 1920) {
  const cur = new Date().getFullYear();
  return Array.from({ length: cur - from + 1 }, (_, i) => String(cur - i));
}
