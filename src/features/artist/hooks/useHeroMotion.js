"use client";
import { useEffect, useRef } from "react";
export function useHeroMotion() {
  const element = useRef(null);
  useEffect(() => {
    const stage = element.current;
    if (!stage) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    function draw() {
      const progress = preference.matches
        ? 0
        : Math.min(
            Math.max(-stage.getBoundingClientRect().top / stage.offsetHeight, 0),
            1,
          );
      stage.style.setProperty("--stage-lift", `${progress * -60}px`);
      stage.style.setProperty("--stage-scale", String(1 - progress * 0.035));
      stage.style.setProperty("--portrait-lift", `${progress * -25}px`);
      frame = 0;
    }
    function scroll() {
      if (!frame) frame = requestAnimationFrame(draw);
    }
    draw();
    addEventListener("scroll", scroll, { passive: true });
    preference.addEventListener("change", draw);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", scroll);
      preference.removeEventListener("change", draw);
    };
  }, []);
  return element;
}
