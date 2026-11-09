/* exported createInquiry */
function createInquiry(parameters) {
  if (parameters._honey || parameters.consent !== "yes")
    throw new Error("Please complete the inquiry consent.");
  if (!parameters.payload || parameters.payload.length > 16000)
    throw new Error("Invalid request size.");
  const { data, start, end } = validateInquiry(JSON.parse(parameters.payload));
  assertSlotFree(data);
  const config = bookingConfig(),
    cache = CacheService.getScriptCache();
  const hour = Utilities.formatDate(new Date(), "UTC", "yyyyMMddHH");
  const count = Number(cache.get("requests-" + hour) || 0);
  if (count >= config.maxHourly || MailApp.getRemainingDailyQuota() < 2)
    throw new Error(
      "The booking desk is busy. Please contact Ritik directly by email or Instagram.",
    );
  const fingerprint = tokenDigest(JSON.stringify(data));
  if (cache.get("duplicate-" + fingerprint))
    return responsePage(
      "Already received.",
      "<p>This inquiry was recently submitted. Please wait for the artist’s reply.</p>",
    );
  const id = Utilities.getUuid(),
    token = Utilities.getUuid() + Utilities.getUuid(),
    createdAt = new Date().toISOString(),
    expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
  const sheet = bookingSheet();
  const event = Calendar.Events.insert(
    {
      summary: "[TENTATIVE] - Review Needed · " + data.type,
      description: requestSummary(data) + "\nRequest: " + id,
      start: { dateTime: start.toISOString(), timeZone: data.timezone },
      end: { dateTime: end.toISOString(), timeZone: data.timezone },
      location: [data.venue, data.city, data.state].filter(Boolean).join(", "),
      status: "tentative",
      visibility: "private",
      transparency: "transparent",
      guestsCanInviteOthers: false,
      guestsCanModify: false,
      guestsCanSeeOtherGuests: false,
    },
    config.calendarId,
    { sendUpdates: "none" },
  );
  try {
    sheet.appendRow([
      id,
      "tentative",
      event.id,
      createdAt,
      expiresAt,
      tokenDigest(token),
      JSON.stringify(data),
      "pending",
    ]);
  } catch (error) {
    Calendar.Events.remove(config.calendarId, event.id, { sendUpdates: "none" });
    throw error;
  }
  cache.put("requests-" + hour, String(count + 1), 3600);
  cache.put("duplicate-" + fingerprint, id, 600);
  const record = readRequest(id);
  const url =
    ScriptApp.getService().getUrl() +
    "?id=" +
    encodeURIComponent(id) +
    "&token=" +
    encodeURIComponent(token);
  try {
    MailApp.sendEmail({
      to: config.artistEmail,
      subject: "[REVIEW NEEDED] " + data.type + " · " + data.date,
      body: requestSummary(data) + "\n\nReview & approve/decline: " + url,
      htmlBody:
        "<pre>" +
        escapeHtml(requestSummary(data)) +
        "</pre><p><a href='" +
        escapeHtml(url) +
        "'>Review this booking request</a></p><p>The client has not been invited. Approval expires after seven days.</p>",
    });
    record.notification = "sent";
    writeRequest(record);
  } catch {
    record.notification = "failed";
    writeRequest(record);
    return responsePage(
      "Request saved.",
      "<p>Your request is tentative, but the artist notification could not be sent. Please email the artist with this reference: <strong>" +
        escapeHtml(id) +
        "</strong>.</p>",
    );
  }
  return responsePage(
    "Request received — awaiting approval.",
    "<p>Your preferred date is tentative. Ritik will review your request before a calendar invite is sent.</p><p>Reference: " +
      escapeHtml(id) +
      "</p>",
  );
}
