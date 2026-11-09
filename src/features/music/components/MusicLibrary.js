"use client";
import { useState } from "react";
import { tracks, listeningPlatforms } from "@/config/media";
import ExternalLink from "@/shared/ui/ExternalLink";
import { socials } from "@/config/socials";
export default function MusicLibrary() {
  const [category, setCategory] = useState("Live highlights");
  const filtered = tracks.filter((t) => t.category === category);
  return (
    <section className="library">
      <div className="sectionTag">THE LISTENING ROOM</div>
      <h2>Choose your mood.</h2>
      <div className="tabs" role="group" aria-label="Recording category">
        {["Live highlights", "Studio covers", "Acoustic sessions"].map((c) => (
          <button
            key={c}
            className={category === c ? "selected" : ""}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="recordingGrid">
          {filtered.map((track) => (
            <article className="panel" key={track.id}>
              <h3>{track.title}</h3>
              <audio controls preload="none" src={track.src} aria-label={track.title}>
                Your browser does not support audio playback.
              </audio>
            </article>
          ))}
        </div>
      ) : (
        <div className="emptyState">
          <span>↗</span>
          <h3>The latest performances live on Instagram.</h3>
          <p>
            Explore Ritik’s reels for live music and covers. Artist recordings will appear
            here when released.
          </p>
          <ExternalLink href={socials.reels}>Explore the reel room ↗</ExternalLink>
        </div>
      )}
      {listeningPlatforms.map((platform) => (
        <ExternalLink key={platform.name} href={platform.url}>
          Listen on {platform.name} ↗
        </ExternalLink>
      ))}
    </section>
  );
}
