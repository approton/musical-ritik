"use client";
import Pressable from "@/shared/ui/Pressable";
import Link from "next/link";
import { useSound } from "@/shared/audio/SoundProvider";
import NativeAudioControls from "./NativeAudioControls";
import Spectrum from "./Spectrum";
export default function MusicDock() {
  const {
    dockOpen,
    playing,
    togglePlayback,
    nextTrack,
    stop,
    analyser,
    volume,
    changeVolume,
    error,
    mode,
    track,
  } = useSound();
  if (!dockOpen && !error) return null;
  return (
    <aside className="dock" aria-label="Music player">
      <Pressable
        className="dockPlay"
        onClick={togglePlayback}
        aria-label={playing ? "Pause background music" : "Play background music"}
      >
        {playing ? "Ⅱ" : "▶"}
      </Pressable>
      <div>
        <strong>{mode === "recording" ? track.title : "Acoustic soundcheck"}</strong>
        <small>
          {mode === "recording"
            ? `${track.instrument} · shuffle`
            : "Interactive synthesized demo"}{" "}
          · <Link href="/credits">Credits</Link>
        </small>
        {error && <p role="alert">{error}</p>}
      </div>
      <Spectrum analyser={analyser} playing={playing} />
      {mode === "recording" && (
        <Pressable onClick={nextTrack} aria-label="Next instrumental track">
          ⏭
        </Pressable>
      )}
      <label className="volumeLabel">
        Volume
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => changeVolume(Number(e.target.value))}
        />
      </label>
      <Pressable onClick={stop} aria-label="Close music player">
        ×
      </Pressable>
      {mode === "recording" && <NativeAudioControls />}
    </aside>
  );
}
