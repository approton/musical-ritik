import test from "node:test";
import assert from "node:assert/strict";
import {
  initialBooking,
  validateBooking,
  bookingMessage,
  localDate,
} from "../src/features/booking/lib/booking.mjs";
const now = new Date("2026-11-09T13:00:00Z");
const valid = {
  ...initialBooking,
  name: "Event Planner",
  email: "planner@example.com",
  phone: "+91 9876543210",
  date: "2026-11-10",
  time: "18:00",
  venue: "Online",
  timezone: "UTC",
};
test("valid future appointment passes all validation", () => {
  assert.deepEqual(validateBooking(valid, 2, now), {});
});
test("past dates and elapsed times today are rejected", () => {
  assert.ok(validateBooking({ ...valid, date: "2026-11-08" }, 0, now).date);
  assert.ok(
    validateBooking({ ...valid, date: "2026-11-09", time: "12:59" }, 0, now).time,
  );
});
test("event step rejects missing date, invalid time and unknown type", () => {
  const errors = validateBooking(
    { ...valid, date: "", time: "25:70", type: "Unknown" },
    0,
    now,
  );
  assert.ok(errors.date);
  assert.ok(errors.time);
  assert.ok(errors.type);
});
test("contact step rejects invalid contact information", () => {
  const errors = validateBooking(
    { ...valid, email: "no-email", phone: "123", name: "" },
    1,
    now,
  );
  assert.ok(errors.email);
  assert.ok(errors.phone);
  assert.ok(errors.name);
});
test("message includes artist approval and appointment details", () => {
  const message = bookingMessage({ ...valid, type: "Consultation" });
  assert.match(message, /Consultation/);
  assert.match(message, /tentative until confirmed/);
  assert.match(message, /planner@example.com/);
});
test("date helper uses local calendar date", () => {
  assert.equal(localDate(now), "2026-11-09");
});

test("nonexistent calendar dates are rejected", () => {
  assert.ok(validateBooking({ ...valid, date: "2027-02-31" }, 0, now).date);
});

test("future times are compared in the selected event timezone", () => {
  const data = {
    ...valid,
    date: "2026-11-09",
    time: "10:00",
    timezone: "America/New_York",
  };
  assert.equal(
    validateBooking(data, 0, new Date("2026-11-09T13:00:00Z")).time,
    undefined,
  );
});
