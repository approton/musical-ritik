"use client";
import Pressable from "@/shared/ui/Pressable";
import { useEffect, useRef, useState } from "react";
import { useSound } from "@/shared/audio/SoundProvider";
import { GUITAR_PITCHES } from "@/shared/audio/audio-engine";
export default function GuitarStrings() {
  const { pluck, toggleDemo } = useSound();
  const [active, setActive] = useState(-1);
  const timeout = useRef(null);
  useEffect(() => () => clearTimeout(timeout.current), []);
  function play(i) {
    pluck(i);
    setActive(i);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setActive(-1), 500);
  }
  return (
    <div className="instrument">
      <div className="instrumentHead">
        <span>THE INTERACTIVE SOUNDCHECK</span>
        <span>HEADPHONES RECOMMENDED ↗</span>
      </div>
      <div className="strings">
        {GUITAR_PITCHES.map((pitch, i) => (
          <Pressable
            key={pitch}
            className={active === i ? "vibrate" : ""}
            onClick={() => play(i)}
            aria-label={`Play ${["E2", "A2", "D3", "G3", "B3", "E4"][i]} guitar string`}
          >
            <span>{["E", "A", "D", "G", "B", "E"][i]}</span>
            <i style={{ height: `${(6 - i) * 0.55 + 1}px` }} />
            <small>0{i + 1}</small>
          </Pressable>
        ))}
      </div>
      <div className="instrumentFoot">
        <span>PLUCK TO PLAY</span>
        <Pressable onClick={toggleDemo}>▶ PLAY THE SOUND DEMO</Pressable>
      </div>
    </div>
  );
}
