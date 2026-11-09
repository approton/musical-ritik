"use client";
import { integrations } from "@/config/integrations";
export default function DeliveryForm({ data, subject, booking = false }) {
  const calendar = booking && integrations.bookingWebAppUrl;
  const endpoint =
    calendar || `https://formsubmit.co/${integrations.formSubmitRecipient}`;
  return (
    <form
      className="deliveryForm"
      action={endpoint}
      method="POST"
      target="_blank"
      rel="noopener noreferrer"
    >
      <input type="hidden" name="_subject" value={subject} />
      <input type="hidden" name="_template" value="table" />
      <input
        className="honeyField"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {calendar ? (
        <>
          <input type="hidden" name="action" value="request" />
          <input type="hidden" name="payload" value={JSON.stringify(data)} />
        </>
      ) : (
        Object.entries(data).map(([name, value]) => (
          <input type="hidden" name={name} value={String(value)} key={name} />
        ))
      )}
      <label className="consent">
        <input type="checkbox" required name="consent" value="yes" />I agree to send these
        details to Ritik through {calendar ? "Google" : "FormSubmit"} for this inquiry.
      </label>
      <button className="primary submit" type="submit">
        {calendar ? "Send tentative booking request" : "Send inquiry by email"} ↗
      </button>
      <p className="formNote">
        {calendar
          ? "Google opens a delivery confirmation page. Your booking still needs artist approval."
          : "FormSubmit opens in a new tab and may ask for verification. Email delivery does not reserve a date."}
      </p>
    </form>
  );
}
