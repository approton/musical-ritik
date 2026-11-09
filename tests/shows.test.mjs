import test from "node:test";
import assert from "node:assert/strict";
import { parseCsv, showsFromCsv } from "../src/shared/content/parse-shows.mjs";
test("CSV supports quoted commas, newlines and escaped quotes", () => {
  assert.deepEqual(parseCsv('a,b\r\n"One, two","A ""quote"""'), [
    ["a", "b"],
    ["One, two", 'A "quote"'],
  ]);
});
test("only published, valid dated shows are exposed", () => {
  const result = showsFromCsv(
    "id,title,startsAt,venue,city,published,ticketUrl\n1,Live,2026-12-01T18:00:00+05:30,Lounge,Delhi,true,https://example.com/tickets\n2,Private,2026-12-02T18:00:00+05:30,Home,Delhi,false,\n3,Invalid,bad,Lounge,Delhi,true,",
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "1");
});
test("non-https ticket URLs are excluded", () => {
  assert.equal(
    showsFromCsv(
      "id,title,startsAt,venue,city,published,ticketUrl\n1,Live,2026-12-01T18:00:00Z,Lounge,Delhi,true,javascript:alert(1)",
    )[0].ticketUrl,
    "",
  );
});
test("malformed CSV fails instead of publishing corrupt content", () => {
  assert.throws(() => parseCsv('a,"b'), /Malformed/);
  assert.throws(() => showsFromCsv("title\nShow"), /Missing/);
});
