import FloatingField from "@/shared/ui/FloatingField";
export default function FormField({ label, name, error, children, ...props }) {
  const id = `booking-${name}`;
  return children ? (
    <label htmlFor={id}>
      {label}
      {children}
      {error && (
        <span className="fieldError" id={`${id}-error`}>
          {error}
        </span>
      )}
    </label>
  ) : (
    <FloatingField id={id} name={name} label={label} error={error} {...props} />
  );
}
