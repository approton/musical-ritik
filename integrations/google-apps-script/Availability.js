/* exported availableSlots, assertSlotFree, availabilityResponse */
function availableSlots(params) {
  const date = String(params.date || ""),
    timezone = String(params.timezone || "Asia/Kolkata"),
    duration = String(params.duration || "60 minutes");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !["Asia/Kolkata", "Asia/Dubai", "Europe/London", "America/New_York", "UTC"].includes(
      timezone,
    )
  )
    throw new Error("Choose a valid date and timezone.");
  const minutes = {
    "30 minutes": 30,
    "60 minutes": 60,
    "90 minutes": 90,
    "2 hours": 120,
    "Let’s discuss": 60,
  }[duration];
  if (!minutes) throw new Error("Choose a duration.");
  const start = Utilities.parseDate(date + " 00:00", timezone, "yyyy-MM-dd HH:mm"),
    end = new Date(start.getTime() + 86400000);
  if (
    Utilities.formatDate(start, timezone, "yyyy-MM-dd") !== date ||
    end < new Date() ||
    start.getTime() > Date.now() + 366 * 86400000
  )
    throw new Error("Choose a date within the next year.");
  const config = bookingConfig();
  const calendarIds = [...new Set([config.calendarId, ...config.blockingCalendarIds])];
  const reply = Calendar.Freebusy.query({
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    timeZone: timezone,
    items: calendarIds.map((id) => ({ id })),
  });
  const busyBlocks = [];
  calendarIds.forEach((id) => {
    const result = reply.calendars[id];
    if (!result || result.errors)
      throw new Error("An artist calendar could not be checked.");
    busyBlocks.push(...result.busy);
  });
  const properties = PropertiesService.getScriptProperties();
  const open = Number(properties.getProperty("OPEN_HOUR") || 10),
    close = Number(properties.getProperty("CLOSE_HOUR") || 23);
  const slots = [];
  for (let minute = open * 60; minute + minutes <= close * 60; minute += 30) {
    const time =
      String(Math.floor(minute / 60)).padStart(2, "0") +
      ":" +
      String(minute % 60).padStart(2, "0");
    const slotStart = Utilities.parseDate(
        date + " " + time,
        timezone,
        "yyyy-MM-dd HH:mm",
      ),
      slotEnd = new Date(slotStart.getTime() + minutes * 60000);
    if (
      slotStart > new Date() &&
      !busyBlocks.some(
        (busy) => new Date(busy.start) < slotEnd && new Date(busy.end) > slotStart,
      )
    )
      slots.push(time);
  }
  return slots;
}
function assertSlotFree(data) {
  if (!availableSlots(data).includes(data.time))
    throw new Error(
      "This slot is no longer available. Please return to the website and select a different time.",
    );
}
function availabilityResponse(params) {
  try {
    return ContentService.createTextOutput(
      JSON.stringify({
        ok: true,
        slots: availableSlots(params),
        checkedAt: new Date().toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch {
    return ContentService.createTextOutput(
      JSON.stringify({
        ok: false,
        error: "Availability could not be checked. Please contact the artist.",
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
