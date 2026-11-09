import Image from "next/image";
import ExternalLink from "@/shared/ui/ExternalLink";
import { socials } from "@/config/socials";
export default function ReelCard({ reel }) {
  return (
    <ExternalLink
      className={`reelCard ${reel?.thumbnail ? "thumbnailReel" : ""}`}
      href={reel?.url || socials.reels}
    >
      {reel?.thumbnail ? (
        <Image
          src={reel.thumbnail}
          width={360}
          height={640}
          alt={`${reel.title} — Instagram reel preview by Ritik Pandey`}
        />
      ) : (
        <div className="vinyl" aria-hidden="true">
          <div>r.</div>
        </div>
      )}
      <span className="reelPlay" aria-hidden="true">
        ▶
      </span>
      <div className="reelCaption">
        <small>{reel?.category || "THE INSTAGRAM REEL ROOM"}</small>
        <h3>{reel?.title || "Catch the next goosebump moment."}</h3>
        <p>@musicalritikofficiall · Instagram</p>
        <span className="textLink">Watch this reel ↗</span>
      </div>
    </ExternalLink>
  );
}
