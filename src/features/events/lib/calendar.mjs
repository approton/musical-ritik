export function eventCalendar(show) {
  const date = new Date(show.startsAt);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid show date");
  const stamp = (d) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  const escape = (value) =>
    String(value)
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ritik//Live Shows//EN",
    "BEGIN:VEVENT",
    `UID:${escape(show.id)}@ritik.local`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(date)}`,
    `SUMMARY:${escape(show.title)}`,
    `LOCATION:${escape(show.venue + ", " + show.city)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
