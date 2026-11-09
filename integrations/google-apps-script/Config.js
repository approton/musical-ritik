/* exported bookingConfig, bookingSheet, readRequest, writeRequest, escapeHtml, responsePage, tokenDigest */
function bookingConfig() {
  const p = PropertiesService.getScriptProperties();
  const config = {
    calendarId: p.getProperty("CALENDAR_ID"),
    blockingCalendarIds: (p.getProperty("BLOCKING_CALENDAR_IDS") || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    sheetId: p.getProperty("BOOKINGS_SHEET_ID"),
    artistEmail: p.getProperty("ARTIST_EMAIL"),
    maxHourly: Number(p.getProperty("MAX_REQUESTS_PER_HOUR") || 20),
  };
  if (!config.calendarId || !config.sheetId || !config.artistEmail)
    throw new Error(
      "Booking service is not configured. Please contact the artist directly.",
    );
  return config;
}
function bookingSheet() {
  const doc = SpreadsheetApp.openById(bookingConfig().sheetId);
  let sheet = doc.getSheetByName("Requests");
  if (!sheet) {
    sheet = doc.insertSheet("Requests");
    sheet.appendRow([
      "id",
      "status",
      "eventId",
      "createdAt",
      "expiresAt",
      "tokenHash",
      "payload",
      "notification",
      "reminderSent",
    ]);
  }
  return sheet;
}
function readRequest(id) {
  const sheet = bookingSheet(),
    rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === id)
      return {
        sheet,
        row: i + 1,
        id: rows[i][0],
        status: rows[i][1],
        eventId: rows[i][2],
        createdAt: rows[i][3],
        expiresAt: rows[i][4],
        tokenHash: rows[i][5],
        data: JSON.parse(rows[i][6]),
        notification: rows[i][7],
      };
  }
  throw new Error("Request not found.");
}
function writeRequest(record) {
  record.sheet
    .getRange(record.row, 2, 1, 7)
    .setValues([
      [
        record.status,
        record.eventId,
        record.createdAt,
        record.expiresAt,
        record.tokenHash,
        JSON.stringify(record.data),
        record.notification,
      ],
    ]);
}
function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch],
  );
}
function responsePage(title, message) {
  return HtmlService.createHtmlOutput(
    `<!doctype html><html><head><base target="_top"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ritik · ${escapeHtml(title)}</title></head><body style="background:#08080c;color:#f1f0eb;font:16px/1.8 Arial;padding:8%;max-width:760px;margin:auto"><h1>${escapeHtml(title)}</h1>${message}<p>Ritik · The Voice. The Strings. The Stage.</p></body></html>`,
  );
}
function tokenDigest(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value)
    .map((byte) => (byte & 255).toString(16).padStart(2, "0"))
    .join("");
}
