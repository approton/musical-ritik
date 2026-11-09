export function parseCsv(text) {
  const rows = [];
  let row = [],
    field = "",
    quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') {
        field += '"';
        i++;
      } else quoted = !quoted;
    } else if (ch === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  row.push(field);
  if (row.some(Boolean)) rows.push(row);
  if (quoted) throw new Error("Malformed CSV");
  return rows;
}
export function showsFromCsv(text) {
  const [headers, ...rows] = parseCsv(text);
  if (
    !headers ||
    !["id", "title", "startsAt", "venue", "city", "published"].every((key) =>
      headers.includes(key),
    )
  )
    throw new Error("Missing show columns");
  return rows
    .map((row) =>
      Object.fromEntries(headers.map((key, i) => [key, row[i]?.trim() || ""])),
    )
    .filter(
      (show) =>
        show.published.toLowerCase() === "true" &&
        show.id &&
        show.title &&
        show.venue &&
        show.city &&
        !Number.isNaN(Date.parse(show.startsAt)) &&
        /T.*(?:Z|[+-]\d\d:\d\d)$/.test(show.startsAt),
    )
    .map((show) => ({
      ...show,
      ticketUrl: /^https:\/\//.test(show.ticketUrl) ? show.ticketUrl : "",
    }));
}
