/* exported doGet, doPost */
function doGet(e) {
  try {
    if (e.parameter.mode === "availability") return availabilityResponse(e.parameter);
    if (e.parameter.id && e.parameter.token) return reviewInquiry(e.parameter);
    return responsePage(
      "Ritik booking desk.",
      "<p>Submit an inquiry through the artist website. Dates require direct artist approval.</p>",
    );
  } catch (error) {
    return responsePage(
      "Unable to continue.",
      "<p>" + escapeHtml(error.message) + "</p>",
    );
  }
}
function doPost(e) {
  const form = e.parameter || {};
  if (
    form.action === "clientSubmit" ||
    (e.postData && e.postData.type.split(";")[0] === "application/json")
  ) {
    let result;
    let lock;
    try {
      if (e.postData.contents.length > 18000) throw new Error("Request too large.");
      const body =
        form.action === "clientSubmit"
          ? {
              action: "submit",
              receipt: form.receipt,
              consent: form.consent,
              data: JSON.parse(form.payload),
            }
          : JSON.parse(e.postData.contents);
      if (body.action === "submit") {
        lock = LockService.getScriptLock();
        if (!lock.tryLock(5000)) throw new Error("The booking desk is busy. Try again.");
      }
      result = clientBookings(body);
    } catch (error) {
      result = { ok: false, error: error.message };
    } finally {
      if (lock && lock.hasLock()) lock.releaseLock();
    }
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON,
    );
  }
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000))
    return responsePage(
      "Please try again.",
      "<p>The booking desk is processing another request.</p>",
    );
  try {
    const params = e.parameter || {};
    return params.action === "decision" ? decideInquiry(params) : createInquiry(params);
  } catch (error) {
    return responsePage(
      "Request could not complete.",
      "<p>" +
        escapeHtml(error.message) +
        "</p><p>Please contact Ritik directly if the problem persists.</p>",
    );
  } finally {
    lock.releaseLock();
  }
}
