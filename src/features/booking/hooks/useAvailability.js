"use client";
import { useEffect, useState } from "react";
import { integrations } from "@/config/integrations";
export function useAvailability({ date, timezone, duration }) {
  const [result, setResult] = useState({ key: "", slots: [], status: "idle", error: "" });
  const key = `${date}|${timezone}|${duration}`;
  useEffect(() => {
    if (!integrations.bookingWebAppUrl || !date) return;
    const controller = new AbortController();
    const url = new URL(integrations.bookingWebAppUrl);
    url.searchParams.set("mode", "availability");
    url.searchParams.set("date", date);
    url.searchParams.set("timezone", timezone);
    url.searchParams.set("duration", duration);
    fetch(url, { signal: controller.signal, cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Availability could not load.");
        return response.json();
      })
      .then((data) => {
        if (!data.ok || !Array.isArray(data.slots))
          throw new Error(data.error || "Availability is unavailable.");
        setResult({
          key,
          slots: data.slots.filter((slot) => /^([01]\d|2[0-3]):[0-5]\d$/.test(slot)),
          status: "ready",
          error: "",
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError")
          setResult({
            key,
            slots: [],
            status: "error",
            error:
              "Live availability could not be checked. Retry or contact Ritik directly.",
          });
      });
    return () => controller.abort();
  }, [key, date, timezone, duration]);
  if (!integrations.bookingWebAppUrl)
    return { status: "unconfigured", slots: [], error: "" };
  if (!date) return { status: "idle", slots: [], error: "" };
  return result.key === key ? result : { status: "loading", slots: [], error: "" };
}
