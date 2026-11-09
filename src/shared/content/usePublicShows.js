"use client";
import { useEffect, useState } from "react";
import { shows } from "@/config/media";
import { integrations } from "@/config/integrations";
import { showsFromCsv } from "./parse-shows.mjs";
export function usePublicShows() {
  const [items, setItems] = useState(shows),
    [warning, setWarning] = useState("");
  useEffect(() => {
    if (!integrations.showsFeedUrl) return;
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(integrations.showsFeedUrl, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Feed unavailable");
        setItems(showsFromCsv(await response.text()));
        setWarning("");
      } catch (error) {
        if (error.name !== "AbortError")
          setWarning("Live dates could not refresh. Please confirm details with Ritik.");
      }
    }
    load();
    const timer = setInterval(load, 60000);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, []);
  return { items, warning };
}
