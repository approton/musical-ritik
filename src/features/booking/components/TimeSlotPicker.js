export default function TimeSlotPicker({ value, onChange, error, availability }) {
  const manual = availability.status === "unconfigured";
  const slots = manual
    ? Array.from(
        { length: 48 },
        (_, index) =>
          `${String(Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`,
      )
    : availability.slots;
  const disabled = !manual && availability.status !== "ready";
  return (
    <label htmlFor="booking-time">
      {manual ? "Preferred time (availability unverified)" : "Available start time"}
      <select
        id="booking-time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby="booking-time-note"
      >
        <option value="">
          {availability.status === "loading"
            ? "Checking Google Calendar…"
            : "Choose a time"}
        </option>
        {slots.map((slot) => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </select>
      <small className="availabilityNote" id="booking-time-note">
        {manual
          ? "Live Calendar is not connected yet. This is a preferred-time inquiry, not a checked available slot."
          : availability.status === "idle"
            ? "Choose a date first."
            : availability.status === "loading"
              ? "Checking the artist’s free/busy calendar."
              : availability.status === "error"
                ? availability.error
                : slots.length
                  ? "Availability checked. Artist approval is still required."
                  : "No available start times for this date and duration. Try another date."}
      </small>
      {error && <span className="fieldError">{error}</span>}
    </label>
  );
}
