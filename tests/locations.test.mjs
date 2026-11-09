import test from "node:test";
import assert from "node:assert/strict";
import {
  indiaStates,
  normalizeStates,
  uniqueCities,
  cityApiStates,
} from "../src/features/booking/lib/india-locations.mjs";
test("India fallback includes 28 states and 8 union territories", () =>
  assert.equal(indiaStates.length, 36));
test("API historical union territories normalize to the merged territory", () =>
  assert.deepEqual(
    normalizeStates([
      { name: "Dadra and Nagar Haveli" },
      { name: "Daman and Diu" },
      { name: "Uttar Pradesh" },
    ]),
    ["Dadra and Nagar Haveli and Daman and Diu", "Uttar Pradesh"],
  ));
test("city lookup queries both historical territories for the merged state", () =>
  assert.deepEqual(cityApiStates("Dadra and Nagar Haveli and Daman and Diu"), [
    "Dadra and Nagar Haveli",
    "Daman and Diu",
  ]));
test("city lists remove accented duplicates and invalid values", () =>
  assert.deepEqual(uniqueCities(["Agra", "Āgra", "Lucknow", null, ""]), [
    "Agra",
    "Lucknow",
  ]));
