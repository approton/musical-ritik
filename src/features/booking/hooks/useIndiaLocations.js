"use client";
import { useEffect, useState } from "react";
import {
  indiaStates,
  normalizeStates,
  uniqueCities,
  cityApiStates,
} from "../lib/india-locations.mjs";
const api = "https://countriesnow.space/api/v0.1/countries";
const cityCache = new Map();
async function lookup(path, payload, signal) {
  const response = await fetch(`${api}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
  if (!response.ok) throw new Error("Location lookup unavailable");
  const result = await response.json();
  if (result.error) throw new Error("Location lookup unavailable");
  return result.data;
}
export function useIndiaLocations(state) {
  const [states, setStates] = useState(indiaStates),
    [result, setResult] = useState({ state: "", cities: [], status: "idle" });
  useEffect(() => {
    const controller = new AbortController();
    lookup("states", { country: "India" }, controller.signal)
      .then((data) => {
        const names = normalizeStates(data.states || []);
        if (names.length >= 30) setStates(names);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!state) return;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    async function load() {
      try {
        const cached = cityCache.get(state);
        const cities =
          cached ||
          uniqueCities(
            (
              await Promise.all(
                cityApiStates(state).map((name) =>
                  lookup(
                    "state/cities",
                    { country: "India", state: name },
                    controller.signal,
                  ),
                ),
              )
            ).flat(),
          );
        if (!cities.length) throw new Error("No city list");
        cityCache.set(state, cities);
        setResult({ state, cities, status: "ready" });
      } catch {
        if (!controller.signal.aborted) setResult({ state, cities: [], status: "error" });
        else if (!cityCache.has(state)) setResult({ state, cities: [], status: "error" });
      } finally {
        clearTimeout(timer);
      }
    }
    load();
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [state]);
  return {
    states,
    cities: result.state === state ? result.cities : [],
    status: !state ? "idle" : result.state === state ? result.status : "loading",
  };
}
