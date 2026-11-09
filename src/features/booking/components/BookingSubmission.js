"use client";
import { useRef, useState } from "react";
import { receiptFor, requestBookings, clearPendingReceipt } from "../lib/client-bookings";

export default function BookingSubmission({ data, onSuccess }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const sending = useRef(false);
  async function submit(event) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    setError("");
    try {
      const receipt = receiptFor(data);
      const [booking] = await requestBookings({
        action: "submit",
        receipt,
        consent: "yes",
        data,
      });
      if (!booking) throw new Error("Could not confirm the request. Please retry.");
      try {
        clearPendingReceipt();
      } finally {
        onSuccess(booking);
      }
    } catch (problem) {
      setError(problem.message || "Unable to submit. Please try again.");
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }
  return (
    <form className="deliveryForm" onSubmit={submit} aria-busy={busy}>
      <label className="consent">
        <input type="checkbox" required /> I agree to send my booking details to Ritik for
        approval.
      </label>
      <button className="primary submit" disabled={busy}>
        {busy && <span className="bookingSpinner" aria-hidden="true" />}
        {busy ? "Submitting request…" : "Send tentative booking request"}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
