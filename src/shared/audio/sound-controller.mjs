export function createSoundController({
  tracks,
  createEngine,
  createAudio,
  onChange,
  analyseMedia = () => true,
  randomIndex = (max) => {
    const bytes = new Uint32Array(1);
    globalThis.crypto.getRandomValues(bytes);
    return bytes[0] % max;
  },
}) {
  let engine = null,
    audio = null,
    mediaAnalysed = false,
    current = -1,
    operation = 0,
    wantsRecording = false,
    demoTimer = null,
    demoStep = 0;
  let state = {
    enabled: false,
    playing: false,
    dockOpen: false,
    volume: 0.3,
    error: "",
    mode: "recording",
    track: tracks[0],
  };
  const analyser = { current: null };
  const stopListeners = new Set();
  function patch(update) {
    state = { ...state, ...update };
    onChange(state);
  }
  function getEngine() {
    if (!engine) {
      engine = createEngine();
      analyser.current = engine.analyser;
      engine.setVolume(state.volume);
    }
    return engine;
  }
  function clearDemo() {
    clearInterval(demoTimer);
    demoTimer = null;
  }
  function getAudio() {
    if (!audio) {
      audio = createAudio();
      audio.preload = "metadata";
      mediaAnalysed = analyseMedia();
      if (mediaAnalysed) getEngine().attachMedia(audio);
      else audio.volume = state.volume;
      audio.onplay = () => {
        if (state.dockOpen) wantsRecording = true;
      };
      audio.onended = () => {
        if (wantsRecording) nextTrack();
      };
      audio.onplaying = () => {
        if (wantsRecording) patch({ enabled: true, playing: true });
        else audio.pause();
      };
      audio.onpause = () => {
        if (state.mode === "recording") patch({ enabled: false, playing: false });
      };
      audio.onerror = () => {
        wantsRecording = false;
        patch({
          enabled: false,
          playing: false,
          error: "This track could not load. Try the next track.",
        });
      };
    }
    return audio;
  }
  function pause(close = false) {
    stopListeners.forEach((listener) => listener());
    operation++;
    wantsRecording = false;
    clearDemo();
    audio?.pause();
    engine?.pause().catch(() => {});
    patch({
      enabled: false,
      playing: false,
      ...(close ? { dockOpen: false, error: "" } : {}),
    });
  }
  async function playRecording(index) {
    const attempt = ++operation;
    clearDemo();
    try {
      const media = getAudio();
      wantsRecording = true;
      if (index !== current) {
        current = index;
        media.src = tracks[index].src;
      }
      patch({ track: tracks[index], mode: "recording", dockOpen: true, error: "" });
      // Both calls must happen inside the original user gesture, before any await (mobile Safari).
      const resuming = mediaAnalysed ? getEngine().resume() : Promise.resolve();
      const playback = media.play();
      await Promise.all([resuming, playback]);
      if (attempt !== operation) return false;
      patch({ enabled: true, playing: true });
      return true;
    } catch {
      if (attempt === operation) {
        wantsRecording = false;
        audio?.pause();
        patch({
          enabled: false,
          playing: false,
          error: "Tap play to start the playlist. If it cannot load, try the next track.",
        });
      }
      return false;
    }
  }
  function nextTrack() {
    const choices = tracks.map((_, index) => index).filter((index) => index !== current);
    return playRecording(choices[randomIndex(choices.length)]);
  }
  function startAmbient() {
    return current < 0 ? nextTrack() : playRecording(current);
  }
  async function enableAudio() {
    try {
      const synth = getEngine();
      await synth.resume();
      patch({ enabled: true, error: "" });
      return synth;
    } catch {
      patch({ enabled: false, error: "Audio is unavailable in this browser." });
      return null;
    }
  }
  async function playFrequency(frequency) {
    const synth = await enableAudio();
    synth?.pluck(frequency);
  }
  async function toggleDemo() {
    if (state.playing && state.mode === "soundcheck") {
      pause();
      return;
    }
    const attempt = ++operation;
    wantsRecording = false;
    audio?.pause();
    clearDemo();
    const synth = await enableAudio();
    if (!synth || attempt !== operation) return;
    patch({ playing: true, enabled: true, dockOpen: true, mode: "soundcheck" });
    const notes = [82.41, 146.83, 196, 329.63, 246.94, 196, 146.83, 246.94];
    demoTimer = setInterval(() => synth.pluck(notes[demoStep++ % notes.length]), 360);
  }
  function togglePlayback() {
    if (state.playing) {
      pause();
      return Promise.resolve(false);
    }
    return state.mode === "recording" ? startAmbient() : toggleDemo();
  }
  function toggleSound() {
    if (state.enabled || state.playing) {
      pause();
      return Promise.resolve(false);
    }
    return startAmbient();
  }
  function changeVolume(value) {
    const volume = Math.max(0, Math.min(1, Number(value)));
    if (audio && !mediaAnalysed) audio.volume = volume;
    engine?.setVolume(volume);
    patch({ volume });
  }
  function dispose() {
    operation++;
    wantsRecording = false;
    clearDemo();
    if (audio) {
      audio.onplaying = null;
      audio.onpause = null;
      audio.onerror = null;
      audio.onended = null;
      audio.pause();
      audio.src = "";
      audio = null;
    }
    engine?.close().catch(() => {});
    engine = null;
    current = -1;
    analyser.current = null;
  }
  return {
    analyser,
    getMediaElement: () => audio,
    onStop: (listener) => {
      stopListeners.add(listener);
      return () => stopListeners.delete(listener);
    },
    enableAudio,
    playFrequency,
    startAmbient,
    nextTrack,
    toggleSound,
    toggleDemo,
    togglePlayback,
    pauseBackground: () => pause(),
    stop: () => pause(true),
    changeVolume,
    dispose,
  };
}
