"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { statusLabels } from "../lib/client-bookings";

export default function BookingComplete({ booking, onRestart }) {
  const [visible, setVisible] = useState(true);
  const title = useRef(null);
  useEffect(() => {
    title.current?.focus({ preventScroll: true });
    const timer = setTimeout(() => setVisible(false), 12000);
    return () => clearTimeout(timer);
  }, []);
  const status = statusLabels[booking.status] || "Request received";
  return (
    <section id="booking-form" className="bookingForm">
      <h3 ref={title} tabIndex={-1}>
        Booking request received
      </h3>
      <div className="actions">
        <button type="button" className="secondary" onClick={onRestart}>
          Book another
        </button>
      </div>
      {booking.notification === "failed" && (
        <p>
          Ritik’s notification could not be sent. Please contact him about your request.
        </p>
      )}
      {visible &&
        createPortal(
          <aside className="bookingToast">
            <div role="status">
              <strong>Appointment submitted successfully</strong>
              <p>
                {booking.status === "tentative"
                  ? `We’ll email ${booking.email} when Ritik approves or declines your appointment request.`
                  : `${status}. Check ${booking.email} for the booking decision.`}
              </p>
            </div>
            <button
              type="button"
              aria-label="Dismiss booking notification"
              onClick={() => setVisible(false)}
            >
              ×
            </button>
          </aside>,
          document.body,
        )}
    </section>
  );
}
