"use client";
import { useState } from "react";
import Link from "next/link";
import ExternalLink from "@/shared/ui/ExternalLink";
import { usePublicShows } from "@/shared/content/usePublicShows";
import { socials } from "@/config/socials";
import { eventCalendar } from "../lib/calendar.mjs";
import { downloadFile } from "@/shared/lib/download";
export default function EventList() {
  const { items: shows, warning } = usePublicShows();
  const [view, setView] = useState("Upcoming");
  const [now] = useState(() => Date.now());
  const items = shows
    .filter((show) =>
      view === "Upcoming"
        ? new Date(show.startsAt).getTime() >= now
        : new Date(show.startsAt).getTime() < now,
    )
    .sort((a, b) =>
      view === "Upcoming"
        ? new Date(a.startsAt) - new Date(b.startsAt)
        : new Date(b.startsAt) - new Date(a.startsAt),
    );
  return (
    <>
      {warning && (
        <p className="formNote" role="status">
          {warning}
        </p>
      )}
      <div className="tabs" role="group" aria-label="Show dates">
        <button
          className={view === "Upcoming" ? "selected" : ""}
          onClick={() => setView("Upcoming")}
          aria-pressed={view === "Upcoming"}
        >
          Upcoming
        </button>
        <button
          className={view === "Past" ? "selected" : ""}
          onClick={() => setView("Past")}
          aria-pressed={view === "Past"}
        >
          Past shows
        </button>
      </div>
      {items.length ? (
        items.map((show) => (
          <article key={show.id} className="eventRow">
            <time dateTime={show.startsAt}>
              {new Date(show.startsAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </time>
            <div>
              <h3>{show.title}</h3>
              <p>
                {show.venue} · {show.city}
              </p>
            </div>
            {show.ticketUrl && (
              <ExternalLink href={show.ticketUrl}>Tickets ↗</ExternalLink>
            )}
            <button
              className="secondary"
              onClick={() =>
                downloadFile("ritik-live.ics", eventCalendar(show), "text/calendar")
              }
            >
              Add to calendar
            </button>
          </article>
        ))
      ) : (
        <div className="emptyState">
          <span>✳</span>
          <h2>
            {view === "Upcoming"
              ? "The next stage is taking shape."
              : "Every stage has a story."}
          </h2>
          <p>
            {view === "Upcoming"
              ? "No public dates are listed here yet. Follow Instagram for announcements, or enquire about your own event."
              : "Explore live moments in the gallery while past show details are being curated."}
          </p>
          <div className="actions">
            <Link className="primary" href={view === "Upcoming" ? "/book" : "/gallery"}>
              {view === "Upcoming" ? "Bring Ritik to your stage" : "Explore the gallery"}{" "}
              ↗
            </Link>
            <ExternalLink href={socials.instagram}>Follow for updates ↗</ExternalLink>
          </div>
        </div>
      )}
    </>
  );
}
