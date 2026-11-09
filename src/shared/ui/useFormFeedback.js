"use client";
import { useSound } from "@/shared/audio/SoundProvider";
export function useFormFeedback() {
  const { enabled, playFrequency } = useSound();
  return (success = true) => {
    if (enabled) playFrequency(success ? 329.63 : 196);
  };
}
