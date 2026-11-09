"use client";
import Pressable from "@/shared/ui/Pressable";
import { useEffect, useRef, useState } from "react";
import { useSound } from "@/shared/audio/SoundProvider";
import { lanes, emptyPattern, initialPattern } from "../data/instruments";
export default function StepSequencer() {
  const [pattern, setPattern] = useState(initialPattern),
    [running, setRunning] = useState(false),
    [bpm, setBpm] = useState(92),
    [beat, setBeat] = useState(-1);
  const position = useRef(0);
  const { playFrequency, pauseBackground, enableAudio, enabled, onStop } = useSound();
  useEffect(
    () =>
      onStop(() => {
        setRunning(false);
        setBeat(-1);
        position.current = 0;
      }),
    [onStop],
  );
  useEffect(() => {
    if (!running || !enabled) return;
    function tick() {
      const next = position.current++ % 16;
      setBeat(next);
      pattern.forEach((row, i) => {
        if (row[next]) playFrequency(lanes[i].hz);
      });
    }
    const timer = setInterval(tick, 60000 / bpm / 4);
    return () => clearInterval(timer);
  }, [running, enabled, bpm, pattern, playFrequency]);
  async function toggle() {
    pauseBackground();
    if (running) {
      setRunning(false);
      setBeat(-1);
      position.current = 0;
    } else if (await enableAudio()) setRunning(true);
  }
  function toggleCell(lane, step) {
    setPattern((previous) =>
      previous.map((row, i) =>
        i === lane ? row.map((cell, j) => (j === step ? !cell : cell)) : row,
      ),
    );
  }
  return (
    <section className="sequencer panel">
      <div className="sectionTop">
        <div>
          <div className="sectionTag">02 / BUILD YOUR OWN LOOP</div>
          <h2>Make the room move.</h2>
        </div>
        <label className="tempo">
          Tempo · {bpm} BPM
          <input
            type="range"
            min="50"
            max="160"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="sequencerScroll">
        <div className="sequencerGrid">
          <div className="stepNumbers">
            <span />
            {Array.from({ length: 16 }, (_, i) => (
              <small key={i} className={beat === i ? "currentBeat" : ""}>
                {i + 1}
              </small>
            ))}
          </div>
          {lanes.map((lane, i) => (
            <div className="sequenceRow" key={lane.label}>
              <strong>{lane.label}</strong>
              {pattern[i].map((selected, j) => (
                <Pressable
                  key={j}
                  aria-label={`${lane.label}, step ${j + 1}`}
                  aria-pressed={selected}
                  className={`${selected ? "stepOn" : ""} ${beat === j ? "stepPlaying" : ""}`}
                  onClick={() => toggleCell(i, j)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="formActions">
        <Pressable className="primary" onClick={toggle}>
          {running ? "Stop loop ■" : "Play your loop ▶"}
        </Pressable>
        <Pressable className="secondary" onClick={() => setPattern(emptyPattern())}>
          Clear
        </Pressable>
        <Pressable className="secondary" onClick={() => setPattern(initialPattern())}>
          Load melody
        </Pressable>
      </div>
      <p className="formNote">
        Four voices, sixteen steps. Your loop stays in this session. Background music
        pauses when you start a loop.
      </p>
    </section>
  );
}
