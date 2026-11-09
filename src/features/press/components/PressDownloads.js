"use client";
import { artist } from "@/config/artist";
import { downloadFile } from "@/shared/lib/download";
export default function PressDownloads() {
  return (
    <div className="actions">
      <button
        className="primary"
        onClick={() =>
          downloadFile(
            "ritik-artist-bio.txt",
            `${artist.name} — Live vocalist & guitarist\n\n${artist.bio}\n\nInstagram: https://www.instagram.com/musicalritikofficiall/`,
          )
        }
      >
        Download artist bio ↓
      </button>
      <a className="textLink" href="/ritik-live.jpeg" download="ritik-live.jpeg">
        Download press photo ↓
      </a>
    </div>
  );
}
