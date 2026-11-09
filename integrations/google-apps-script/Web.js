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
