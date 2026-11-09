"use client";
import { useState } from "react";
import { localDate, zonedNow } from "../lib/booking.mjs";
export default function DatePicker({ value, onChange, error, timezone }) {
  const [month, setMonth] = useState(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const today = zonedNow(new Date(), timezone).date;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const offset = (month.getDay() + 6) % 7;
  function move(amount) {
    setMonth(new Date(month.getFullYear(), month.getMonth() + amount, 1));
  }
  return (
    <div className="datePicker">
      <div className="calendarHeader">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => move(-1)}
          disabled={localDate(month).slice(0, 7) <= today.slice(0, 7)}
        >
          ←
        </button>
        <strong aria-live="polite">
          {month.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </strong>
        <button type="button" aria-label="Next month" onClick={() => move(1)}>
          →
        </button>
      </div>
      <div className="calendarGrid">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <span key={d}>{d}</span>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <span key={`empty-${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const date = localDate(new Date(month.getFullYear(), month.getMonth(), i + 1));
          return (
            <button
              type="button"
              key={date}
              disabled={date < today}
              aria-pressed={date === value}
              aria-label={new Date(date + "T12:00").toLocaleDateString("en-IN", {
                dateStyle: "full",
              })}
              className={date === value ? "chosen" : ""}
              onClick={() => onChange(date)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <label>
        Preferred date
        <input
          type="date"
          value={value}
          min={today}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "date-error" : undefined}
        />
      </label>
      {error && (
        <p className="fieldError" id="date-error">
          {error}
        </p>
      )}
      <small>
        Choose a preferred date. This calendar does not show live availability.
      </small>
    </div>
  );
}
