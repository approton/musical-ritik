import { integrations } from "../../config/integrations.js";
import { legacyConfirmation } from "./booking-confirmation.mjs";

export async function calendarBookings(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
  function fail(status, error) {
    res.statusCode = status;
    res.end(JSON.stringify({ ok: false, error }));
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return fail(405, "Use POST.");
  }
  if (!req.headers["content-type"]?.startsWith("application/json"))
    return fail(415, "Send JSON.");
  let body;
  try {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 18000) return fail(413, "Request too large.");
      chunks.push(chunk);
    }
    body = JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    return fail(400, "Invalid request.");
  }
  if (body?.action !== "submit") return fail(400, "Invalid action.");
  if (body.consent !== "yes" || !body.data || !/^[a-f0-9]{48}$/.test(body.receipt))
    return fail(400, "Please review your booking and consent.");
  try {
    const content = new URLSearchParams({
      action: "clientSubmit",
      receipt: body.receipt,
      consent: "yes",
      payload: JSON.stringify(body.data),
    });
    const response = await fetch(integrations.bookingWebAppUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: content,
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error();
    if (!response.headers.get("content-type")?.includes("application/json")) {
      const html = await response.text();
      try {
        return res.end(
          JSON.stringify({ ok: true, bookings: [legacyConfirmation(html, body.data)] }),
        );
      } catch (error) {
        return fail(422, error.message);
      }
    }
    const result = await response.json();
    if (!result.ok) return fail(422, result.error || "Please review your booking.");
    if (!Array.isArray(result.bookings)) throw new Error();
    res.end(JSON.stringify({ ok: true, bookings: result.bookings }));
  } catch {
    fail(502, "Could not confirm the result. Please contact Ritik before trying again.");
  }
}
