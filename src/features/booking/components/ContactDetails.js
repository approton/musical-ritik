import FloatingField from "@/shared/ui/FloatingField";
import FormField from "./FormField";
export default function ContactDetails({ data, update, errors }) {
  return (
    <>
      <div className="formGrid">
        {[
          ["name", "Your full name", "text", "name"],
          ["email", "Email address", "email", "email"],
          ["phone", "Phone / WhatsApp", "tel", "tel"],
        ].map(([name, label, type, autoComplete]) => (
          <FormField
            key={name}
            name={name}
            label={label}
            type={type}
            autoComplete={autoComplete}
            value={data[name]}
            onChange={(e) => update(name, e.target.value)}
            error={errors[name]}
          />
        ))}
        <FormField
          name="guests"
          label="Expected guests"
          type="number"
          min="1"
          max="1000000"
          value={data.guests}
          onChange={(e) => update("guests", e.target.value)}
        />
        <FormField name="budget" label="Budget range">
          <select
            id="booking-budget"
            value={data.budget}
            onChange={(e) => update("budget", e.target.value)}
          >
            {[
              "Let’s discuss",
              "Under ₹15,000",
              "₹15,000–₹30,000",
              "₹30,000–₹60,000",
              "₹60,000+",
            ].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </FormField>
      </div>
      <FloatingField
        label="Your vision / special requests"
        multiline
        value={data.requests}
        maxLength={2000}
        onChange={(e) => update("requests", e.target.value)}
        rows={4}
      />
    </>
  );
}
