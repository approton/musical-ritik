import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import vm from "node:vm";

function backend() {
  const rows = [],
    events = new Map(),
    mail = [],
    patches = [];
  let created = false;
  const sheet = {
    appendRow(row) {
      rows.push([...row]);
    },
    getDataRange() {
      return { getValues: () => rows };
    },
    getRange(row, col) {
      return {
        setValues(values) {
          values[0].forEach((value, i) => {
            rows[row - 1][col - 1 + i] = value;
          });
        },
        setValue(value) {
          rows[row - 1][col - 1] = value;
        },
      };
    },
  };
  const properties = {
    CALENDAR_ID: "private-calendar",
    BOOKINGS_SHEET_ID: "private-sheet",
    ARTIST_EMAIL: "artist@example.com",
  };
  const cache = new Map();
  const context = vm.createContext({
    PropertiesService: {
      getScriptProperties: () => ({ getProperty: (key) => properties[key] || null }),
    },
    SpreadsheetApp: {
      openById: () => ({
        getSheetByName: () => (created ? sheet : null),
        insertSheet: () => {
          created = true;
          return sheet;
        },
      }),
    },
    CacheService: {
      getScriptCache: () => ({
        get: (key) => cache.get(key),
        put: (key, value) => cache.set(key, value),
      }),
    },
    MailApp: {
      getRemainingDailyQuota: () => 100,
      sendEmail: (message) => mail.push(message),
    },
    ScriptApp: {
      getService: () => ({
        getUrl: () => "https://script.google.com/macros/s/test/exec",
      }),
    },
    HtmlService: { createHtmlOutput: (html) => ({ html }) },
    Utilities: {
      DigestAlgorithm: { SHA_256: "sha256" },
      getUuid: randomUUID,
      computeDigest: (_, value) => [...createHash("sha256").update(value).digest()],
      parseDate: (value) => new Date(value.replace(" ", "T") + ":00Z"),
      formatDate: (value, _, pattern) =>
        pattern === "yyyy-MM-dd HH:mm"
          ? value.toISOString().slice(0, 16).replace("T", " ")
          : pattern === "yyyy-MM-dd"
            ? value.toISOString().slice(0, 10)
            : value.toISOString().slice(0, 13),
    },
    Calendar: {
      Freebusy: {
        query: () => ({
          calendars: {
            "private-calendar": {
              busy: [...events.values()]
                .filter(
                  (e) => e.status === "confirmed" && e.transparency !== "transparent",
                )
                .map((e) => ({ start: e.start.dateTime, end: e.end.dateTime })),
            },
          },
        }),
      },
      Events: {
        insert(event) {
          const result = {
            ...event,
            id: `event-${events.size}`,
            htmlLink: "https://calendar.google.com",
          };
          events.set(result.id, result);
          return result;
        },
        get: (_, id) => events.get(id),
        list: () => ({ items: [...events.values()] }),
        patch(update, _, id, options) {
          patches.push({ update, options });
          events.set(id, { ...events.get(id), ...update });
        },
        remove: (_, id) => events.delete(id),
      },
    },
  });
  for (const name of ["Config", "Validation", "Availability", "Requests", "Approval"]) {
    vm.runInContext(
      readFileSync(
        new URL(`../integrations/google-apps-script/${name}.js`, import.meta.url),
        "utf8",
      ),
      context,
    );
  }
  const future = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
  const data = {
    name: "Test Planner",
    email: "planner@example.com",
    phone: "9876543210",
    type: "Consultation",
    date: future,
    time: "12:00",
    timezone: "UTC",
    venue: "Online",
    duration: "60 minutes",
    budget: "To discuss",
    requests: "Test appointment",
  };
  function submit() {
    return context.createInquiry({
      payload: JSON.stringify(data),
      consent: "yes",
      _honey: "",
    });
  }
  function approval() {
    const url = new URL(mail[0].body.split("Review & approve/decline: ")[1]);
    return { id: url.searchParams.get("id"), token: url.searchParams.get("token") };
  }
  return { context, data, rows, events, mail, patches, submit, approval };
}

test("request is tentative and sends no client calendar invitation", () => {
  const f = backend();
  f.submit();
  const event = [...f.events.values()][0];
  assert.equal(event.status, "tentative");
  assert.equal(event.attendees, undefined);
  assert.equal(f.mail.length, 1);
  assert.equal(f.mail[0].to, "artist@example.com");
  assert.equal(f.rows[1][1], "tentative");
});
test("opening a review link never approves a booking", () => {
  const f = backend();
  f.submit();
  const page = f.context.reviewInquiry(f.approval());
  assert.match(page.html, /method='POST'/);
  assert.equal(f.patches.length, 0);
  assert.equal(f.rows[1][1], "tentative");
});
test("approval confirms and requests the invite; token cannot be replayed", () => {
  const f = backend();
  f.submit();
  const params = { ...f.approval(), decision: "approve" };
  f.context.decideInquiry(params);
  assert.equal(f.patches[0].update.status, "confirmed");
  assert.equal(f.patches[0].options.sendUpdates, "all");
  assert.equal(f.patches[0].update.attendees[0].email, "planner@example.com");
  assert.throws(() => f.context.decideInquiry(params), /invalid or expired|already/);
});
test("overlapping confirmed slots cannot be requested", () => {
  const f = backend();
  f.events.set("busy", {
    id: "busy",
    status: "confirmed",
    start: { dateTime: `${f.data.date}T11:30:00Z` },
    end: { dateTime: `${f.data.date}T13:30:00Z` },
  });
  assert.throws(() => f.submit(), /no longer available/);
  assert.equal(f.mail.length, 0);
});
test("duplicate form submission creates only one pending event", () => {
  const f = backend();
  f.submit();
  f.submit();
  assert.equal(f.events.size, 1);
  assert.equal(f.mail.length, 1);
});
test("decline removes the tentative event and notifies the client", () => {
  const f = backend();
  f.submit();
  f.context.decideInquiry({ ...f.approval(), decision: "decline" });
  assert.equal(f.events.size, 0);
  assert.equal(f.rows[1][1], "declined");
  assert.equal(f.mail[1].to, "planner@example.com");
});
