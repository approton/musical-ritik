import LocationPicker from "./LocationPicker";
import TimeSlotPicker from "./TimeSlotPicker";
import DatePicker from "./DatePicker";
import FormField from "./FormField";
import EventTypePicker from "./EventTypePicker";
export default function EventDetails({ data, update, errors, availability }) {
  return (
    <>
      <EventTypePicker value={data.type} onChange={(type) => update("type", type)} />
      <DatePicker
        timezone={data.timezone}
        value={data.date}
        onChange={(date) => update("date", date)}
        error={errors.date}
      />
      <div className="formGrid">
        <TimeSlotPicker
          availability={availability}
          value={data.time}
          onChange={(time) => update("time", time)}
          error={errors.time}
        />
        <FormField label="Event timezone" name="timezone">
          <select
            id="booking-timezone"
            value={data.timezone}
            onChange={(e) => update("timezone", e.target.value)}
          >
            {[
              "Asia/Kolkata",
              "Asia/Dubai",
              "Europe/London",
              "America/New_York",
              "UTC",
            ].map((zone) => (
              <option key={zone}>{zone}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Duration" name="duration">
          <select
            id="booking-duration"
            value={data.duration}
            onChange={(e) => update("duration", e.target.value)}
          >
            {["30 minutes", "60 minutes", "90 minutes", "2 hours", "Let’s discuss"].map(
              (d) => (
                <option key={d}>{d}</option>
              ),
            )}
          </select>
        </FormField>
      </div>
      <LocationPicker data={data} update={update} errors={errors} />
    </>
  );
}
