/**
 * Handles two timestamp formats produced by the ESP32 firmware:
 *   ISO:        "2026-04-23T14:30:00"  (sensor solo)
 *   BR datetime: "23/04/2026 20:41:05" (sensor ar)
 */
export function formatTimestamp(ts: string, timeOnly = false): string {
  try {
    if (ts.includes("T")) {
      const d = new Date(ts.replace("T", " "));
      const hh = d.getHours().toString().padStart(2, "0");
      const mm = d.getMinutes().toString().padStart(2, "0");
      if (timeOnly) return `${hh}:${mm}`;
      const dd = d.getDate().toString().padStart(2, "0");
      const mo = (d.getMonth() + 1).toString().padStart(2, "0");
      return `${dd}/${mo} ${hh}:${mm}`;
    }

    // BR format: "23/04/2026 20:41:05"
    const [datePart, timePart] = ts.split(" ");
    const time = timePart?.slice(0, 5) ?? "";
    if (timeOnly) return time;
    const [dd, mo] = datePart.split("/");
    return `${dd}/${mo} ${time}`;
  } catch {
    return ts.slice(0, 16);
  }
}
