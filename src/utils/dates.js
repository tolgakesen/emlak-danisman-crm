export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// dateStr: "YYYY-MM-DD" -> "gecikmis" | "bugun" | "yaklasan" | null (tarih yoksa)
export function followUpBucket(dateStr) {
  if (!dateStr) return null;
  const t = todayStr();
  if (dateStr < t) return "gecikmis";
  if (dateStr === t) return "bugun";
  return "yaklasan";
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}.${m}.${y}`;
}
