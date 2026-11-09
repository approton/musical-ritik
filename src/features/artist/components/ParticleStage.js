"use client";
import { useEffect, useRef } from "react";
export default function ParticleStage() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current,
      ctx = c.getContext("2d"),
      pointer = { x: 0, y: 0 };
    let frame,
      t = 0,
      w = 0,
      h = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pts = Array.from({ length: 220 }, (_, i) => {
      const y = 1 - (i / 219) * 2,
        r = Math.sqrt(1 - y * y),
        theta = i * Math.PI * (3 - Math.sqrt(5));
      return [r * Math.cos(theta), y, r * Math.sin(theta)];
    });
    function resize() {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * devicePixelRatio;
      c.height = h * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }
    function move(e) {
      pointer.x = (e.clientX / innerWidth - 0.5) * 0.6;
      pointer.y = (e.clientY / innerHeight - 0.5) * 0.3;
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      const rotation = t + pointer.x + scrollY * 0.0003;
      pts.forEach(([x, y, z]) => {
        const xx = x * Math.cos(rotation) - z * Math.sin(rotation),
          zz = x * Math.sin(rotation) + z * Math.cos(rotation),
          yy = y * Math.cos(pointer.y) - zz * Math.sin(pointer.y),
          depth = 2.7 + zz,
          scale = (Math.min(w, h) * 0.7) / depth;
        ctx.fillStyle = `rgba(245,172,66,${0.15 + (zz + 1) * 0.2})`;
        ctx.beginPath();
        ctx.arc(
          w * 0.55 + xx * scale,
          h * 0.45 + yy * scale,
          1.1 + (zz + 1) * 0.7,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      });
      if (!reduced) {
        t += 0.002;
        frame = requestAnimationFrame(draw);
      }
    }
    resize();
    draw();
    addEventListener("resize", resize);
    addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", move);
    };
  }, []);
  return <canvas className="particleStage" ref={ref} aria-hidden="true" />;
}
