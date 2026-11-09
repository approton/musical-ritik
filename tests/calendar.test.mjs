import test from "node:test";
import assert from "node:assert/strict";
import { eventCalendar } from "../src/features/events/lib/calendar.mjs";
test("calendar download uses UTC timestamps and escapes injected fields", () => {
  const text = eventCalendar({
    id: "show-1",
    startsAt: "2026-12-01T18:30:00+05:30",
    title: "Live, acoustic; set\nwith Ritik",
    venue: "Lounge",
    city: "Delhi",
  });
  assert.ok(text.includes("DTSTART:20261201T130000Z"));
  assert.ok(text.includes("SUMMARY:Live\\, acoustic\\; set\\nwith Ritik"));
  assert.ok(text.endsWith("END:VCALENDAR"));
});
test("invalid show date cannot produce a corrupt calendar file", () =>
  assert.throws(() => eventCalendar({ startsAt: "invalid" }), /Invalid show date/));
