"use client";
import { useEffect, useState } from "react";
import { createAudioEngine, GUITAR_PITCHES } from "./audio-engine";
import { createSoundController } from "./sound-controller.mjs";
import { soundtrack } from "@/config/soundtrack";
export function useSoundEngine() {
  const [state, setState] = useState({
    enabled: false,
    playing: false,
    dockOpen: false,
    volume: 0.3,
    error: "",
    mode: "recording",
    track: soundtrack[0],
  });
  const [controller] = useState(() =>
    createSoundController({
      tracks: soundtrack,
      createEngine: createAudioEngine,
      createAudio: () => new Audio(),
      analyseMedia: () => !window.matchMedia("(pointer: coarse)").matches,
      onChange: setState,
    }),
  );
  useEffect(() => () => controller.dispose(), [controller]);
  return {
    ...state,
    ...controller,
    pluck: (index) => controller.playFrequency(GUITAR_PITCHES[index]),
  };
}
