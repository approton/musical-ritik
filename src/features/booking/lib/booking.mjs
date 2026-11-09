export const eventTypes = [
  "Wedding",
  "College fest",
  "Private lounge",
  "Corporate event",
  "Studio session",
  "Consultation",
];
export const initialBooking = {
  name: "",
  email: "",
  phone: "",
  type: "Wedding",
  date: "",
  time: "",
  timezone: "Asia/Kolkata",
  venue: "",
  locationMode: "in-person",
  state: "",
  city: "",
  duration: "60 minutes",
  guests: "",
  budget: "Let’s discuss",
  requests: "",
};
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function zonedNow(now, timezone = "Asia/Kolkata") {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((part) => [part.type, part.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  };
}
export function validateBooking(data, step = 2, now = new Date()) {
  const errors = {};
  let clock;
  try {
    clock = zonedNow(now, data.timezone);
  } catch {
    errors.timezone = "Choose a valid timezone.";
    clock = { date: localDate(now), time: "00:00" };
  }
  if (step === 0 || step === 2) {
    if (!eventTypes.includes(data.type)) errors.type = "Choose an event type.";
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
      Number.isNaN(new Date(data.date + "T00:00:00").getTime()) ||
      localDate(new Date(data.date + "T00:00:00")) !== data.date ||
      data.date < clock.date
    )
      errors.date = "Choose today or a future date.";
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.time))
      errors.time = "Choose a valid time.";
    else if (data.date === clock.date && data.time <= clock.time)
      errors.time = "Please choose a future time.";
    if (data.locationMode !== "online" && data.venue.trim().toLowerCase() !== "online") {
      if (!data.state?.trim()) errors.state = "Choose a state or union territory.";
      if (!data.city?.trim()) errors.city = "Choose or enter your city.";
    }
    if (!data.venue.trim())
      errors.venue = "Add a venue and city, or Online for an appointment.";
  }
  if (step === 1 || step === 2) {
    if (data.name.trim().length < 2) errors.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errors.email = "Enter a valid email address.";
    if (data.phone.replace(/\D/g, "").length < 7)
      errors.phone = "Enter a valid phone or WhatsApp number.";
  }
  return errors;
}
export function bookingMessage(data) {
  return `Hi Ritik! I’d like to enquire about a ${data.type}.\nDate: ${data.date} at ${data.time} (${data.timezone})\nVenue: ${data.venue}${data.locationMode === "online" ? " (online)" : `, ${data.city || ""}, ${data.state || ""}, India`}\nDuration: ${data.duration}\nGuests: ${data.guests || "To discuss"}\nBudget: ${data.budget}\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nRequests: ${data.requests || "None yet"}\nI understand this is tentative until confirmed directly.`;
}
