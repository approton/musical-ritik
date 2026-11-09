"use client";
// Native button activation supports touch, mouse, keyboard and assistive technology.
export default function Pressable({ type = "button", children, ...props }) {
  return (
    <button type={type} {...props}>
      {children}
    </button>
  );
}
