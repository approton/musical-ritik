export const pads = [
  { key: "a", label: "C", hz: 261.63 },
  { key: "s", label: "D", hz: 293.66 },
  { key: "d", label: "E", hz: 329.63 },
  { key: "f", label: "G", hz: 392 },
  { key: "g", label: "A", hz: 440 },
  { key: "h", label: "C⁺", hz: 523.25 },
  { key: "j", label: "D⁺", hz: 587.33 },
  { key: "k", label: "E⁺", hz: 659.25 },
];
export const lanes = [
  { label: "LOW C", hz: 130.81 },
  { label: "E", hz: 329.63 },
  { label: "G", hz: 392 },
  { label: "HIGH C", hz: 523.25 },
];
export const emptyPattern = () => lanes.map(() => Array(16).fill(false));
export const initialPattern = () =>
  lanes.map((_, lane) =>
    Array.from({ length: 16 }, (_, beat) =>
      [
        [0, 8],
        [2, 10],
        [4, 12],
        [6, 14],
      ][lane].includes(beat),
    ),
  );
