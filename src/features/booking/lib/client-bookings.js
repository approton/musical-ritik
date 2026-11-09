const storageKey = "ritik-booking-receipts-v1";
export const statusLabels = {
  tentative: "Pending artist approval",
  approved: "Approved",
  declined: "Declined",
};
export function receiptFor(data) {
  const key = JSON.stringify([
    data.date,
    data.time,
    data.timezone,
    data.duration,
    data.type,
  ]);
  localStorage.removeItem(storageKey);
  const existing = JSON.parse(sessionStorage.getItem("ritik-pending-request") || "null");
  if (existing?.key === key) return existing.receipt;
  const receipt = Array.from(crypto.getRandomValues(new Uint8Array(24)), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  sessionStorage.setItem("ritik-pending-request", JSON.stringify({ key, receipt }));
  return receipt;
}
export function clearPendingReceipt() {
  sessionStorage.removeItem("ritik-pending-request");
}
export async function requestBookings(body, signal) {
  const response = await fetch("/api/booking/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.error || "Please try again.");
  return result.bookings;
}
