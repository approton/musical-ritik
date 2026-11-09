"use client";
import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { galleryPhotos, reels } from "@/config/media";
import PageHeading from "@/shared/ui/PageHeading";
import ReelCard from "./ReelCard";
const PhotoLightbox = dynamic(() => import("./PhotoLightbox"));
export default function GalleryPage() {
  const [tab, setTab] = useState("All moments"),
    [photo, setPhoto] = useState(null);
  return (
    <section className="section gallery">
      <PageHeading
        eyebrow="OFF THE RECORD / THE GALLERY"
        title={
          <>
            Music fades.
            <br />
            <em>Moments stay.</em>
          </>
        }
        description="Five moments from Ritik’s public Instagram. Live energy, acoustic sessions, and life between stages."
      />
      <div className="tabs" role="group" aria-label="Gallery category">
        {["All moments", "Photos", "Reels"].map((t) => (
          <button
            aria-pressed={tab === t}
            className={t === tab ? "selected" : ""}
            onClick={() => setTab(t)}
            key={t}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="galleryGrid">
        {tab !== "Reels" &&
          galleryPhotos.map((item) => (
            <button
              key={item.id}
              className={`galleryPhoto ${item.presentation === "cutout" ? "cutoutCard" : ""}`}
              onClick={() => setPhoto(item)}
              aria-label={`Open photo: ${item.title}`}
            >
              <Image
                src={item.src}
                width={item.width}
                height={item.height}
                alt={item.alt}
              />
              <span>
                <small>ON STAGE / PHOTO</small>
                <strong>{item.title}</strong>
                <b>↗</b>
              </span>
            </button>
          ))}
        {tab !== "Photos" &&
          (reels.length ? (
            reels.slice(0, 5).map((reel) => <ReelCard key={reel.id} reel={reel} />)
          ) : (
            <ReelCard />
          ))}
      </div>
      {photo && <PhotoLightbox photo={photo} onClose={() => setPhoto(null)} />}
    </section>
  );
}
