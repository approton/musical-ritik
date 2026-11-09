"use client";
import { useEffect, useRef } from "react";
import { useSound } from "@/shared/audio/SoundProvider";
export default function NativeAudioControls() {
  const host = useRef(null);
  const { getMediaElement, track } = useSound();
  useEffect(() => {
    const audio = getMediaElement?.();
    if (!audio || !host.current) return;
    audio.controls = true;
    host.current.appendChild(audio);
    return () => {
      audio.controls = false;
      audio.remove();
    };
  }, [getMediaElement, track.id]);
  return (
    <details className="nativeAudioControls">
      <summary>iPhone / native audio controls</summary>
      <div ref={host} />
    </details>
  );
}
