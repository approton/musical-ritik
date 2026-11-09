"use client";
import { useState } from "react";
import DeliveryForm from "@/shared/integrations/DeliveryForm";
import Modal from "@/shared/ui/Modal";
import ExternalLink from "@/shared/ui/ExternalLink";
import { socials } from "@/config/socials";
import { bookingMessage } from "../lib/booking.mjs";
export default function BookingTicket({ data, onClose }) {
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
      <p className="formNote">
        This inquiry has not been delivered automatically. Send it to Ritik directly. Your
        date is only reserved after artist confirmation.
      </p>
      <DeliveryForm
        data={{ ...data, message: bookingMessage(data) }}
        subject={`Booking inquiry: ${data.type} · ${data.date}`}
        booking
      />
    </Modal>
  );
}
