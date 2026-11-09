import test from "node:test";
import assert from "node:assert/strict";
import { byteRange } from "../scripts/static-server.mjs";
test("iPhone MP3 range requests produce valid byte boundaries", () => {
  assert.deepEqual(byteRange("bytes=0-1", 1000), { start: 0, end: 1 });
  assert.deepEqual(byteRange("bytes=500-", 1000), { start: 500, end: 999 });
  assert.deepEqual(byteRange("bytes=-100", 1000), { start: 900, end: 999 });
});
test("invalid byte ranges are rejected", () => {
  assert.equal(byteRange("bytes=2000-", 1000), null);
  assert.equal(byteRange("bytes=20-10", 1000), null);
  assert.equal(byteRange("not-a-range", 1000), null);
});
