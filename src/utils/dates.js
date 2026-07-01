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

function pad2(n) {
  return String(n).padStart(2, "0");
}

// "YYYY-MM-DDTHH:mm" bicimini uretir, datetime-local input'unun default degeri icin.
export function nowDateTimeLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

// value: "YYYY-MM-DDTHH:mm" ya da eski kayitlar icin sadece "YYYY-MM-DD"
export function formatDateTime(value) {
  if (!value) return "";
  const [datePart, timePart] = value.split("T");
  return timePart ? `${formatDate(datePart)} ${timePart}` : formatDate(datePart);
}
