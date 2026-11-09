import { bookingMessage } from "../lib/booking.mjs";
export default function BookingReview({ data }) {
  return (
    <div className="bookingReview">
      <h3>Your next live moment.</h3>
      <dl>
        {[
          ["Experience", data.type],
          ["When", `${data.date} · ${data.time} · ${data.timezone}`],
          [
            "Where",
            data.locationMode === "online"
              ? `${data.venue} (online)`
              : [data.venue, data.city, data.state, "India"].filter(Boolean).join(", "),
          ],
          ["Duration", data.duration],
          ["Contact", `${data.name} · ${data.email}`],
          ["Budget", data.budget],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p>Please verify your event timezone, especially for an online appointment.</p>
      <details>
        <summary>View complete message</summary>
        <pre>{bookingMessage(data)}</pre>
      </details>
    </div>
  );
}
