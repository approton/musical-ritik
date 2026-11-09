/* exported clientBookings */
function clientBookings(body) {
  if (
    body.action !== "submit" ||
    typeof body.receipt !== "string" ||
    !/^[a-f0-9]{48}$/.test(body.receipt)
  )
    throw new Error("Invalid booking request.");
  const sheet = bookingSheet();
  const hash = tokenDigest(body.receipt);
  function findReceipt() {
    return sheet
      .getDataRange()
      .getValues()
      .find((entry) => entry[9] === hash);
  }
  let row = findReceipt();
  if (!row) {
    createInquiry({
      receipt: body.receipt,
      consent: body.consent,
      payload: JSON.stringify(body.data),
    });
    row = findReceipt();
  }
  if (!row) throw new Error("Could not confirm the request.");
  return { ok: true, bookings: [{ status: row[1], notification: row[7] }] };
}
