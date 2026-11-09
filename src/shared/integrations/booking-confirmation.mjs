// HtmlService can wrap the page markup in an escaped JavaScript string.
export function legacyConfirmation(html, data) {
  const markup = html
    .replace(/\\+(?:x([\da-f]{2})|u([\da-f]{4}))/gi, (_, byte, unit) =>
      String.fromCharCode(parseInt(byte || unit, 16)),
    )
    .replace(/\\+\//g, "/");
  const saved = markup.includes("<h1>Request saved.</h1>");
  const pending = /<h1>Request received[^<]*awaiting approval\.<\/h1>/.test(markup);
  const reference = markup.match(
    /reference:\s*(?:<strong>)?([a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12})\b/i,
  )?.[1];
  if ((pending || saved) && reference) {
    const { type, date, time, timezone } = data;
    return {
      type,
      date,
      time,
      timezone,
      reference,
      status: "tentative",
      notification: saved ? "failed" : "sent",
    };
  }
  if (markup.includes("<h1>Already received.</h1>"))
    throw new Error(
      "A matching request was already submitted. Check your email or contact Ritik before trying again.",
    );
  if (markup.includes("This slot is no longer available."))
    throw new Error("That time is no longer available. Please choose another slot.");
  const reason = markup.match(
    /<h1>Request could not complete\.<\/h1><p>([^<>]+)<\/p>/,
  )?.[1];
  if (
    reason &&
    /^(Please (provide|choose|select|complete|shorten) |Unknown experience type\.)/.test(
      reason,
    )
  )
    throw new Error(reason);
  throw new Error(
    "Google did not confirm this booking. Check with Ritik before submitting again.",
  );
}
