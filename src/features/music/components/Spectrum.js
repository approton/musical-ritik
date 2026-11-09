"use client";
import { useEffect, useRef } from "react";
export default function Spectrum({ analyser, playing }) {
  const canvas = useRef(null);
  useEffect(() => {
    let frame;
    const c = canvas.current,
      ctx = c.getContext("2d");
    const data = new Uint8Array(64);
    function draw() {
      ctx.clearRect(0, 0, 140, 30);
      const a = analyser.current;
      if (a) a.getByteFrequencyData(data);
      for (let i = 0; i < 28; i++) {
        const h = playing && a ? Math.max(2, data[i] * 0.105) : 2;
        ctx.fillStyle = "#f5ac42";
        ctx.fillRect(i * 5, 15 - h / 2, 2, h);
      }
      frame = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frame);
  }, [analyser, playing]);
  return (
    <canvas
      ref={canvas}
      width="140"
      height="30"
      className="spectrum"
      aria-label={playing ? "Music playback indicator" : "Audio paused"}
    />
  );
}
