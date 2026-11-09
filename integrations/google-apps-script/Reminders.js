/* exported installReminderTrigger, sendAppointmentReminders */
function installReminderTrigger() {
  if (
    !ScriptApp.getProjectTriggers().some(
      (trigger) => trigger.getHandlerFunction() === "sendAppointmentReminders",
    )
  )
    ScriptApp.newTrigger("sendAppointmentReminders").timeBased().everyHours(1).create();
}
function sendAppointmentReminders() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;
  try {
    const config = bookingConfig(),
      sheet = bookingSheet(),
      rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][1] !== "approved" || rows[i][8] === "sent") continue;
      const event = Calendar.Events.get(config.calendarId, rows[i][2]);
      if (event.status !== "confirmed" || !event.start.dateTime) continue;
      const until = new Date(event.start.dateTime).getTime() - Date.now();
      if (until <= 0 || until > 24 * 3600000 || MailApp.getRemainingDailyQuota() < 1)
        continue;
      const data = JSON.parse(rows[i][6]);
      MailApp.sendEmail({
        to: config.artistEmail,
        subject: "Reminder: " + data.type + " · " + data.date + " " + data.time,
        body:
          "Your approved appointment/performance is within the next 24 hours.\n\n" +
          requestSummary(data) +
          "\n\nCalendar: " +
          event.htmlLink,
      });
      sheet.getRange(i + 1, 9).setValue("sent");
    }
  } finally {
    lock.releaseLock();
  }
}
