export const GUITAR_PITCHES = [82.41, 110, 146.83, 196, 246.94, 329.63];
export function createAudioEngine() {
  try {
    if (navigator.audioSession) navigator.audioSession.type = "playback";
  } catch {}
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext)
    throw new Error(
      "Web Audio is unavailable in this browser. Try a current browser to enable sound.",
    );
  const context = new AudioContext(),
    analyser = context.createAnalyser(),
    master = context.createGain();
  analyser.fftSize = 128;
  master.gain.value = 0.3;
  master.connect(analyser);
  analyser.connect(context.destination);
  const delay = context.createDelay(1),
    feedback = context.createGain(),
    wet = context.createGain();
  delay.delayTime.value = 0.29;
  feedback.gain.value = 0.25;
  wet.gain.value = 0.19;
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(master);
  function tone(frequency, duration = 1.6, offset = 0, type = "triangle", level = 0.12) {
    const start = context.currentTime + offset,
      oscillator = context.createOscillator(),
      gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(
      level,
      start + (type === "sine" ? 0.15 : 0.012),
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(master);
    gain.connect(delay);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  }
  return {
    attachMedia(audio) {
      const source = context.createMediaElementSource(audio);
      source.connect(master);
      return source;
    },
    context,
    analyser,
    resume: () => context.resume(),
    pause: () => context.suspend(),
    close: () => context.close(),
    pluck: (frequency, duration = 1.6, delay = 0) => tone(frequency, duration, delay),
    pad: (frequency) => tone(frequency, 4.5, 0, "sine", 0.035),
    setVolume(value) {
      master.gain.setTargetAtTime(value, context.currentTime, 0.04);
    },
  };
}
