"use client";
import { useId } from "react";
export default function FloatingField({ id, label, multiline = false, error, ...props }) {
  const generated = useId();
  const inputId = id || generated;
  const Control = multiline ? "textarea" : "input";
  return (
    <div className={`floatingField ${error ? "floatingInvalid" : ""}`}>
      <Control
        {...props}
        id={inputId}
        placeholder=" "
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      <label htmlFor={inputId}>{label}</label>
      {error && (
        <span className="fieldError" id={`${inputId}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}
