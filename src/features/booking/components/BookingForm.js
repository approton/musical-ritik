"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { initialBooking, validateBooking } from "../lib/booking.mjs";
import { useAvailability } from "../hooks/useAvailability";
import { useFormFeedback } from "@/shared/ui/useFormFeedback";
import EventDetails from "./EventDetails";
import ContactDetails from "./ContactDetails";
import BookingReview from "./BookingReview";
const BookingTicket = dynamic(() => import("./BookingTicket"));
export default function BookingForm() {
  const [data, setData] = useState(initialBooking),
    [step, setStep] = useState(0),
    [errors, setErrors] = useState({}),
    [ready, setReady] = useState(false),
    [notice, setNotice] = useState("");
  const heading = useRef(null);
  const feedback = useFormFeedback();
  const availability = useAvailability(data);
  function update(name, value) {
    setData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "state" ? { city: "" } : {}),
      ...(["date", "timezone", "duration"].includes(name) ? { time: "" } : {}),
    }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  }
  function advance(e) {
    e.preventDefault();
    const result = validateBooking(data, step);
    if (
      (step === 0 || step === 2) &&
      availability.status !== "unconfigured" &&
      (availability.status !== "ready" || !availability.slots.includes(data.time))
    )
      result.time =
        "Choose a currently available slot after the Calendar check completes.";
    feedback(Object.keys(result).length === 0);
    setErrors(result);
    if (Object.keys(result).length) return;
    if (step < 2) {
      setStep(step + 1);
      requestAnimationFrame(() => heading.current?.focus());
    } else setReady(true);
  }
  function saveDraft() {
    try {
      sessionStorage.setItem("ritik-booking-draft", JSON.stringify(data));
      setNotice("Draft saved in this tab only. It is not sent to the artist.");
    } catch {
      setNotice("Draft saving is unavailable in this browser.");
    }
  }
  function restoreDraft() {
    try {
      const draft = JSON.parse(sessionStorage.getItem("ritik-booking-draft"));
      if (draft && typeof draft === "object") {
        const safe = Object.fromEntries(
          Object.keys(initialBooking).map((key) => [
            key,
            typeof draft[key] === "string" ? draft[key] : initialBooking[key],
          ]),
        );
        setData(safe);
        setNotice("Draft restored.");
      } else setNotice("No draft saved in this tab yet.");
    } catch {
      setNotice("Could not restore a draft.");
    }
  }
  return (
    <>
      <form id="booking-form" className="bookingForm" onSubmit={advance} noValidate>
        <ol className="bookingSteps" aria-label="Booking progress">
          {["The event", "Your details", "Review"].map((title, i) => (
            <li key={title} aria-current={step === i ? "step" : undefined}>
              <b>{i + 1}</b>
              {title}
            </li>
          ))}
        </ol>
        <h3 ref={heading} tabIndex={-1}>
          {["Set the scene.", "Let’s stay in touch.", "One last look."][step]}
        </h3>
        {Object.values(errors).some(Boolean) && (
          <div className="fieldError" role="alert">
            Please check the highlighted fields before continuing.
          </div>
        )}
        {step === 0 && (
          <EventDetails
            data={data}
            update={update}
            errors={errors}
            availability={availability}
          />
        )}{" "}
        {step === 1 && <ContactDetails data={data} update={update} errors={errors} />}{" "}
        {step === 2 && <BookingReview data={data} />}
        <div className="formActions">
          {step > 0 && (
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setStep(step - 1);
                setErrors({});
              }}
            >
              ← Back
            </button>
          )}
          <button className="primary" type="submit">
            {step === 2 ? "Prepare inquiry" : "Continue"} ↗
          </button>
        </div>
        <div className="draftActions">
          <button type="button" onClick={saveDraft}>
            Save tab draft
          </button>
          <button type="button" onClick={restoreDraft}>
            Restore draft
          </button>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("ritik-booking-draft");
              setData({ ...initialBooking });
              setStep(0);
              setErrors({});
              setNotice("Draft cleared.");
            }}
          >
            Clear draft
          </button>
        </div>
        <p className="formNote" role="status">
          {notice ||
            "Your details stay in this browser until you choose to send them. No payment is collected."}
        </p>
      </form>
      {ready && <BookingTicket data={data} onClose={() => setReady(false)} />}
    </>
  );
}
