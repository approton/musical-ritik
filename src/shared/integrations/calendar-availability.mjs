import { integrations } from "../../config/integrations.js";

export async function calendarAvailability(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.statusCode = 405;
    return res.end(JSON.stringify({ ok: false, error: "Use GET." }));
  }
  const query = new URL(req.url, "http://localhost").searchParams;
  const upstream = new URL(integrations.bookingWebAppUrl);
  upstream.searchParams.set("mode", "availability");
  for (const key of ["date", "timezone", "duration"]) {
    const value = query.get(key);
    if (!value || value.length > 64) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ ok: false, error: "Invalid booking parameters." }));
    }
    upstream.searchParams.set(key, value);
  }
  try {
    const response = await fetch(upstream, {
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error();
    const data = await response.json();
    if (data.ok !== true || !Array.isArray(data.slots)) throw new Error();
    res.end(JSON.stringify({ ok: true, slots: data.slots }));
  } catch {
    res.statusCode = 502;
    res.end(
      JSON.stringify({ ok: false, error: "Calendar availability is unavailable." }),
    );
  }
}
