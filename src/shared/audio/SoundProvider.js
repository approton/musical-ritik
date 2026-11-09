"use client";
import { createContext, useContext, useState } from "react";
import { useSoundEngine } from "./useSoundEngine";
const SoundContext = createContext(null);
export function SoundProvider({ children }) {
  const sound = useSoundEngine();
  const [entranceOpen, setEntranceOpen] = useState(true);
  return (
    <SoundContext.Provider
      value={{
        ...sound,
        entranceOpen,
        closeEntrance: () => setEntranceOpen(false),
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}
export function useSound() {
  const sound = useContext(SoundContext);
  if (!sound) throw new Error("useSound requires SoundProvider");
  return sound;
}
