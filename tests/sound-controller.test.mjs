import test from "node:test";
import assert from "node:assert/strict";
import { createSoundController } from "../src/shared/audio/sound-controller.mjs";
function fixture(playOverride) {
  let snapshot;
  const calls = [];
  const audio = {
    src: "",
    pause() {
      calls.push("pause");
      this.onpause?.();
    },
    play() {
      calls.push("play");
      this.onplaying?.();
      return playOverride ? playOverride() : Promise.resolve();
    },
  };
  const engine = {
    analyser: {},
    setVolume() {},
    attachMedia() {},
    resume() {
      calls.push("resume");
      return Promise.resolve();
    },
    pause() {
      calls.push("suspend");
      return Promise.resolve();
    },
    close() {
      return Promise.resolve();
    },
    pluck() {},
  };
  const controller = createSoundController({
    tracks: [
      { id: "guitar", src: "guitar.mp3" },
      { id: "piano", src: "piano.mp3" },
      { id: "violin", src: "violin.mp3" },
    ],
    createEngine: () => engine,
    createAudio: () => audio,
    onChange: (value) => {
      snapshot = value;
    },
    randomIndex: () => 0,
  });
  return {
    controller,
    audio,
    calls,
    get state() {
      return snapshot;
    },
  };
}
test("mobile playback calls resume and play synchronously within the gesture", async () => {
  const f = fixture();
  const promise = f.controller.startAmbient();
  assert.deepEqual(f.calls.slice(0, 2), ["resume", "play"]);
  await promise;
  assert.equal(f.state.playing, true);
  f.controller.dispose();
});
test("closing the dock stops media and syncs the navbar to off", async () => {
  const f = fixture();
  await f.controller.startAmbient();
  f.controller.stop();
  assert.equal(f.state.enabled, false);
  assert.equal(f.state.playing, false);
  assert.equal(f.state.dockOpen, false);
  assert.ok(f.calls.includes("pause"));
  assert.ok(f.calls.includes("suspend"));
  f.controller.dispose();
});
test("pause and resume preserve the current recording", async () => {
  const f = fixture();
  await f.controller.startAmbient();
  const track = f.state.track.id;
  await f.controller.togglePlayback();
  assert.equal(f.state.enabled, false);
  await f.controller.togglePlayback();
  assert.equal(f.state.track.id, track);
  assert.equal(f.state.playing, true);
  f.controller.dispose();
});
test("shuffle never immediately repeats a track", async () => {
  const f = fixture();
  await f.controller.startAmbient();
  const initial = f.state.track.id;
  await f.controller.nextTrack();
  assert.notEqual(f.state.track.id, initial);
  f.controller.dispose();
});
test("a pending play cannot re-enable music after closing", async () => {
  let resolve;
  const f = fixture(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  const pending = f.controller.startAmbient();
  f.controller.stop();
  resolve();
  await pending;
  assert.equal(f.state.playing, false);
  assert.equal(f.state.enabled, false);
  f.controller.dispose();
});
test("failed playback leaves the sound icon off and shows an error", async () => {
  const f = fixture(() => Promise.reject(new Error("NotAllowedError")));
  await f.controller.startAmbient();
  assert.equal(f.state.enabled, false);
  assert.equal(f.state.playing, false);
  assert.match(f.state.error, /Tap play/);
  f.controller.dispose();
});

test("touchscreen recordings play without requiring a Web Audio context", async () => {
  let state;
  const media = {
    play() {
      this.onplaying?.();
      return Promise.resolve();
    },
    pause() {
      this.onpause?.();
    },
  };
  const controller = createSoundController({
    tracks: [
      { id: "one", src: "one.mp3" },
      { id: "two", src: "two.mp3" },
    ],
    createAudio: () => media,
    createEngine: () => {
      throw new Error("Web Audio unavailable");
    },
    analyseMedia: () => false,
    onChange: (s) => {
      state = s;
    },
    randomIndex: () => 0,
  });
  assert.equal(await controller.startAmbient(), true);
  assert.equal(state.playing, true);
  controller.stop();
  assert.equal(state.enabled, false);
  controller.dispose();
});

test("global stop notifies playground loops so they cannot restart on unmute", async () => {
  const f = fixture();
  let stopped = 0;
  const unsubscribe = f.controller.onStop(() => stopped++);
  f.controller.stop();
  assert.equal(stopped, 1);
  unsubscribe();
  f.controller.stop();
  assert.equal(stopped, 1);
  f.controller.dispose();
});
