"use client";
import { useState } from "react";
import FloatingField from "@/shared/ui/FloatingField";
import { useFormFeedback } from "@/shared/ui/useFormFeedback";
import DeliveryForm from "@/shared/integrations/DeliveryForm";
export default function ContactComposer() {
  const [data, setData] = useState(null);
  const feedback = useFormFeedback();
  function prepare(e) {
    e.preventDefault();
    feedback();
    setData(Object.fromEntries(new FormData(e.currentTarget)));
  }
  return (
    <div>
      <form className="contactForm" onSubmit={prepare}>
        <h3>Start a conversation.</h3>
        <div className="formGrid">
          <FloatingField
            name="name"
            label="Your name"
            required
            minLength={2}
            autoComplete="name"
          />
          <FloatingField
            name="email"
            label="Your email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
        <label>
          What’s on your mind?
          <select name="topic">
            <option>Collaboration</option>
            <option>Press & media</option>
            <option>Music / recording</option>
            <option>General inquiry</option>
          </select>
        </label>
        <FloatingField
          name="message"
          label="Your message / your melody"
          multiline
          required
          minLength={10}
          maxLength={3000}
          rows={5}
        />
        <button className="primary submit">Review your message ↗</button>
        <p className="formNote">
          Review first. You choose when to send through FormSubmit.
        </p>
      </form>
      {data && (
        <section className="panel preparedMessage">
          <h3>Ready when you are.</h3>
          <p>
            {data.name} · {data.topic}
          </p>
          <p className="preWrap">{data.message}</p>
          <DeliveryForm data={data} subject={`Ritik website: ${data.topic}`} />
        </section>
      )}
    </div>
  );
}
