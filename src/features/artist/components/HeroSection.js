"use client";
import Pressable from "@/shared/ui/Pressable";
import Image from "next/image";
import Link from "next/link";
import { useHeroMotion } from "../hooks/useHeroMotion";
import ParticleStage from "./ParticleStage";
import { useSound } from "@/shared/audio/SoundProvider";
export default function HeroSection() {
  const { playing, togglePlayback, startAmbient } = useSound();
  const stage = useHeroMotion();
  return (
    <section ref={stage} id="home" className="hero">
      <ParticleStage />
      <div className="heroPhoto">
        <Image
          width={1072}
          height={1477}
          priority
          src="/ritik-cutout.png"
          alt="Ritik singing live while playing his acoustic guitar"
        />
        <div className="photoShade" />
      </div>
      <div className="heroContent">
        <div className="eyebrow">
          <span className="dot" /> LIVE VOCALIST · GUITARIST · PERFORMER
        </div>
        <h1>
          The voice.
          <br />
          The strings.
          <br />
          <em>The stage.</em>
        </h1>
        <p>
          A little soul. A few strings.
          <br />A moment you’ll want to live again.
        </p>
        <div className="actions">
          <Link className="primary" href="/book#booking-form">
            Book a live experience <span>↗</span>
          </Link>
          <Pressable
            className="playAction"
            onClick={playing ? togglePlayback : startAmbient}
          >
            <span className="circle">{playing ? "Ⅱ" : "▶"}</span> Experience the sound
          </Pressable>
        </div>
      </div>
      <div className="photoLabel">
        <span className="dot" /> IN HIS ELEMENT <small>RITIK / LIVE SESSIONS</small>
      </div>
    </section>
  );
}
