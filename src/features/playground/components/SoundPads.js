"use client";
import Pressable from "@/shared/ui/Pressable";
import { useEffect, useRef, useState } from "react";
import { useSound } from "@/shared/audio/SoundProvider";
import { pads } from "../data/instruments";
export default function SoundPads() {
  const { playFrequency } = useSound();
  const [active, setActive] = useState(-1);
  const timer = useRef(null);
  useEffect(() => {
    function onKey(e) {
      if (
        e.repeat ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.target.closest("input,textarea,select,button,a,dialog")
      )
        return;
      const index = pads.findIndex((p) => p.key === e.key.toLowerCase());
      if (index !== -1) {
        e.preventDefault();
        playFrequency(pads[index].hz);
        setActive(index);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setActive(-1), 200);
      }
    }
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("keydown", onKey);
      clearTimeout(timer.current);
    };
  }, [playFrequency]);
  function play(i) {
    playFrequency(pads[i].hz);
    setActive(i);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setActive(-1), 200);
  }
  return (
    <section className="padSection">
      <div className="sectionTag">01 / FIND YOUR MELODY</div>
      <h2>Play by feeling.</h2>
      <p>Tap the pads or use A S D F G H J K on your keyboard.</p>
      <div className="soundPads">
        {pads.map((pad, i) => (
          <Pressable
            key={pad.key}
            className={active === i ? "pad activePad" : "pad"}
            onClick={() => play(i)}
            aria-label={`Play ${pad.label}, keyboard ${pad.key}`}
          >
            <small>{String(i + 1).padStart(2, "0")}</small>
            <strong>{pad.label}</strong>
            <kbd>{pad.key.toUpperCase()}</kbd>
          </Pressable>
        ))}
      </div>
    </section>
  );
}
