import { eventTypes } from "../lib/booking.mjs";
export default function EventTypePicker({ value, onChange }) {
  const labels = {
    Wedding: "Wedding",
    "College fest": "College fest",
    "Private lounge": "Lounge night",
    "Corporate event": "Corporate",
    "Studio session": "Studio session",
    Consultation: "Planning call",
  };
  return (
    <fieldset className="experiencePicker">
      <legend>Choose your experience</legend>
      <div>
        {eventTypes.map((type, i) => (
          <label key={type} className={value === type ? "experienceSelected" : ""}>
            <input
              type="radio"
              name="experience"
              checked={value === type}
              onChange={() => onChange(type)}
            />
            <span className="experienceNumber">0{i + 1}</span>
            <strong>{labels[type]}</strong>
            <span className="choiceMark" aria-hidden="true">
              {value === type ? "↗" : "+"}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
