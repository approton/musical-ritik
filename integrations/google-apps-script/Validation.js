/* exported validateInquiry, requestSummary */
function validateInquiry(input) {
  if (!input || typeof input !== "object") throw new Error("Missing inquiry.");
  const limits = {
    name: 100,
    email: 254,
    phone: 40,
    type: 50,
    date: 10,
    time: 5,
    timezone: 60,
    venue: 250,
    locationMode: 20,
    state: 100,
    city: 100,
    duration: 40,
    guests: 20,
    budget: 100,
    requests: 2000,
  };
  const data = {};
  Object.keys(limits).forEach((key) => {
    data[key] = String(input[key] || "").trim();
    if (data[key].length > limits[key])
      throw new Error("Please shorten the " + key + " field.");
  });
  if (
    data.name.length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
    data.phone.replace(/\D/g, "").length < 7
  )
    throw new Error("Please provide valid contact details.");
  if (
    ![
      "Wedding",
      "College fest",
      "Private lounge",
      "Corporate event",
      "Studio session",
      "Consultation",
    ].includes(data.type)
  )
    throw new Error("Unknown experience type.");
  if (
    !["Asia/Kolkata", "Asia/Dubai", "Europe/London", "America/New_York", "UTC"].includes(
      data.timezone,
    )
  )
    throw new Error("Please select a supported timezone.");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(data.time) ||
    !data.venue
  )
    throw new Error("Please provide a valid date, time and venue.");
  const start = Utilities.parseDate(
    data.date + " " + data.time,
    data.timezone,
    "yyyy-MM-dd HH:mm",
  );
  if (
    Utilities.formatDate(start, data.timezone, "yyyy-MM-dd HH:mm") !==
      data.date + " " + data.time ||
    start <= new Date()
  )
    throw new Error("Please choose a valid future date and time.");
  const durations = {
    "30 minutes": 30,
    "60 minutes": 60,
    "90 minutes": 90,
    "2 hours": 120,
    "Let’s discuss": 60,
  };
  if (!durations[data.duration]) throw new Error("Please select a duration.");
  return {
    data,
    start,
    end: new Date(start.getTime() + durations[data.duration] * 60000),
  };
}
function requestSummary(data) {
  return [
    "Experience: " + data.type,
    "When: " + data.date + " " + data.time + " " + data.timezone,
    "Venue: " + [data.venue, data.city, data.state].filter(Boolean).join(", "),
    "Duration: " + data.duration,
    "Budget: " + data.budget,
    "Guests: " + (data.guests || "To discuss"),
    "Name: " + data.name,
    "Email: " + data.email,
    "Phone: " + data.phone,
    "Requests: " + data.requests,
  ].join("\n");
}
