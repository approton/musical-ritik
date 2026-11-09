"use client";
import Pressable from "@/shared/ui/Pressable";
import { useState } from "react";
import { useSound } from "@/shared/audio/SoundProvider";
import Modal from "@/shared/ui/Modal";
export default function SoundEntrance() {
  const [busy, setBusy] = useState(false);
  const { startAmbient, error, entranceOpen: open, closeEntrance, stop } = useSound();
  async function enter() {
    setBusy(true);
    const started = await startAmbient();
    setBusy(false);
    if (started) closeEntrance();
  }
  if (!open) return null;
  return (
    <Modal
      title="Come a little closer."
      onClose={() => {
        stop();
        closeEntrance();
      }}
    >
      <div className="entranceOrb" aria-hidden="true">
        r.
      </div>
      <span className="sectionTag">THE RITIK EXPERIENCE</span>
      <p className="entranceCopy">
        A few strings. A softer world.
        <br />
        Guitar, piano and violin. A playlist for the mood.
      </p>
      <div className="entranceActions">
        <Pressable className="primary" onClick={enter} disabled={busy}>
          {busy ? "Setting the mood…" : "Enter with sound"} <span>♪ ↗</span>
        </Pressable>
        <Pressable
          className="secondary"
          onClick={() => {
            stop();
            closeEntrance();
          }}
        >
          Explore silently
        </Pressable>
      </div>
      {error && (
        <p className="fieldError" role="alert">
          {error}
        </p>
      )}
      <p className="formNote">
        Sound starts with your tap. You can pause, mute or adjust the volume anytime.
      </p>
    </Modal>
  );
}
