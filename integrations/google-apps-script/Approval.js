/* exported authorizedRequest, reviewInquiry, decideInquiry */
function authorizedRequest(parameters) {
  const record = readRequest(String(parameters.id || ""));
  if (
    !parameters.token ||
    tokenDigest(String(parameters.token)) !== record.tokenHash ||
    new Date(record.expiresAt) < new Date()
  )
    throw new Error(
      "This approval link is invalid or expired. Review the request privately in the booking sheet.",
    );
  if (record.status !== "tentative")
    throw new Error("This request has already been reviewed.");
  return record;
}
function reviewInquiry(parameters) {
  const record = authorizedRequest(parameters);
  const action = escapeHtml(ScriptApp.getService().getUrl());
  return responsePage(
    "Review this request.",
    "<pre style='white-space:pre-wrap'>" +
      escapeHtml(requestSummary(record.data)) +
      "</pre><p>No action is taken until you press a button below. Approve only after agreeing fees and production details.</p><form method='POST' action='" +
      action +
      "'><input type='hidden' name='action' value='decision'><input type='hidden' name='id' value='" +
      escapeHtml(record.id) +
      "'><input type='hidden' name='token' value='" +
      escapeHtml(parameters.token) +
      "'><button name='decision' value='approve' style='padding:15px'>Approve & send calendar invite</button> <button name='decision' value='decline' style='padding:15px'>Decline & notify client</button></form>",
  );
}
function decideInquiry(parameters) {
  if (!["approve", "decline"].includes(parameters.decision))
    throw new Error("Choose approve or decline.");
  const record = authorizedRequest(parameters),
    config = bookingConfig();
  if (parameters.decision === "approve") {
    assertSlotFree(record.data);
    const event = Calendar.Events.get(config.calendarId, record.eventId);
    if (event.status === "cancelled")
      throw new Error(
        "The tentative event was removed. Please handle this request directly.",
      );
    const conflicts =
      Calendar.Events.list(config.calendarId, {
        timeMin: event.start.dateTime,
        timeMax: event.end.dateTime,
        singleEvents: true,
        showDeleted: false,
      }).items || [];
    if (
      conflicts.some(
        (item) =>
          item.id !== event.id &&
          item.status === "confirmed" &&
          item.transparency !== "transparent",
      )
    )
      throw new Error(
        "A confirmed event overlaps this time. Resolve the conflict before approving.",
      );
    Calendar.Events.patch(
      {
        summary: "[CONFIRMED] Ritik · " + record.data.type,
        status: "confirmed",
        transparency: "opaque",
        reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 60 }] },
        attendees: [{ email: record.data.email }],
        description:
          requestSummary(record.data) +
          "\nApproved by artist. Confirm final commercial terms directly.",
      },
      config.calendarId,
      record.eventId,
      { sendUpdates: "all" },
    );
    record.status = "approved";
    record.tokenHash = "";
    writeRequest(record);
    return responsePage(
      "Booking approved.",
      "<p>The event is confirmed and Google Calendar has been asked to notify the client. Guests may need to accept the invitation in their inbox.</p>",
    );
  }
  Calendar.Events.remove(config.calendarId, record.eventId, { sendUpdates: "none" });
  record.status = "declined";
  record.tokenHash = "";
  record.notification = "decline-pending";
  writeRequest(record);
  try {
    MailApp.sendEmail({
      to: record.data.email,
      subject: "Your Ritik booking inquiry · " + record.data.date,
      body: "Thank you for your inquiry. Ritik is unable to confirm this request. Please reply to discuss an alternative date.",
      replyTo: config.artistEmail,
    });
    record.notification = "decline-sent";
    writeRequest(record);
  } catch {
    record.notification = "decline-email-failed";
    writeRequest(record);
    return responsePage(
      "Request declined.",
      "<p>The tentative calendar event was removed, but email delivery failed. Please notify the client directly.</p>",
    );
  }
  return responsePage(
    "Request declined.",
    "<p>The tentative calendar event was removed and the client notification was submitted.</p>",
  );
}
