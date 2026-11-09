"use client";
import { useState } from "react";
import BookingSubmission from "./BookingSubmission";
import Modal from "@/shared/ui/Modal";
import ExternalLink from "@/shared/ui/ExternalLink";
import { socials } from "@/config/socials";
import { bookingMessage } from "../lib/booking.mjs";
export default function BookingTicket({ data, onClose, onSuccess }) {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(bookingMessage(data));
      setStatus("Copied. Open Instagram and paste this message to Ritik.");
    } catch {
      setStatus("Select the text above and copy it manually.");
    }
  }
  return (
    <Modal title="Your inquiry is ready." onClose={onClose}>
      <span className="statusBadge">TENTATIVE / READY TO SEND</span>
      <p>
        {data.name}, your {data.type.toLowerCase()} inquiry for {data.date} is ready to
        share.
      </p>
      <textarea
        className="messagePreview"
        readOnly
        aria-label="Complete booking inquiry"
        value={bookingMessage(data)}
      />
      <div className="actions">
        <button className="primary" onClick={copy}>
          Copy inquiry ↗
        </button>
        <ExternalLink href={socials.instagram}>Send on Instagram ↗</ExternalLink>
      </div>
      <p role="status">{status}</p>
      <p className="formNote">Your date is reserved once Ritik approves it.</p>
      <BookingSubmission data={data} onSuccess={onSuccess} />
    </Modal>
  );
}
