# Booking, approval, availability and reminders

The frontend is complete and can prepare inquiries now. FormSubmit and Google Calendar are separate delivery paths; FormSubmit alone cannot create calendar events or approve bookings.

## What is needed from Ritik

1. Access to the Google account that should own the calendar and approval inbox. The configured booking email is `ritikpandey195@gmail.com`. Confirm that this account should own the integration; do not share its password.
2. A dedicated private Google Calendar ID, plus any personal/work calendar IDs that must also block availability.
3. A private Google Sheet for booking records. Never publish this sheet.
4. Permission for the artist-owned Apps Script project to manage its booking calendar, read free/busy information, send email and run a reminder trigger.
5. Working hours, timezone, allowed durations, travel/setup buffers and the commercial confirmation policy.
6. The deployed Apps Script `/exec` URL. Add it to `src/config/integrations.js` after setup.
7. A real test appointment, artist approval/decline test, invite receipt check and reminder check before going live.

## Start with email inquiries

The booking ticket and contact preview contain a consent checkbox and a Send inquiry by email button. Native POST delivery opens FormSubmit in a new tab. The provider owns the delivery result; the app does not pretend an inquiry was sent before that result.

The recipient is configured in `src/config/integrations.js`. On the first real submission, FormSubmit sends the recipient an activation email. Open the verification link, then submit a test and check the inbox and spam folder. Replace the public email endpoint with FormSubmit’s opaque endpoint token if desired after activation. CAPTCHA remains enabled; a honeypot is included.

Until Google is connected, email inquiries do not reserve dates. Confirm directly with the client.

Official references: [FormSubmit documentation](https://formsubmit.co/documentation), [activation help](https://formsubmit.co/help).

## Connect Google Calendar

This repository includes modular Google Apps Script source in `integrations/google-apps-script/`. It is not deployed by the static Next.js build.

1. Sign in as the artist/manager. Create a dedicated private calendar named Ritik Bookings. Its ID is in Calendar settings → Integrate calendar.
2. Create a private Google Sheet. Copy its document ID from its URL.
3. Create an Apps Script project. Add one script file per `.js` source file in `integrations/google-apps-script/` and paste its content. Google’s editor may display script files with `.gs` extensions; the JavaScript content is the same.
4. Enable the advanced Google Calendar API service (version 3). Copy the provided `appsscript.json` manifest, or add its service and scopes in the editor. If using a standard Google Cloud project, enable the Calendar API there too.
5. Under Project Settings → Script Properties set `CALENDAR_ID`, `BOOKINGS_SHEET_ID`, and `ARTIST_EMAIL`. Optional settings are `MAX_REQUESTS_PER_HOUR` (default 20), `OPEN_HOUR` (default 10), `CLOSE_HOUR` (default 23), and `BLOCKING_CALENDAR_IDS` (comma-separated additional calendars).
6. Deploy as a web app, executing as the artist/manager. Anonymous visitor access is needed for the public booking form; do not expose the private sheet or calendar. Review Google’s permission screen yourself.
7. Put the deployment’s `/exec` URL into `bookingWebAppUrl` in `src/config/integrations.js`, rebuild and redeploy the frontend.
8. Run `installReminderTrigger` once in Apps Script and authorize it. It installs one hourly reminder job. Do not install duplicate triggers.

The website requests only a date’s available start times. The backend calls the Calendar free/busy API, aggregates busy blocks, and returns no private event titles, attendees or descriptions. Configured availability failures disable checked-slot selection instead of silently fabricating available times.

The default schedule uses half-hour starts, 10:00–23:00 in the selected timezone, for dates within one year. “Let’s discuss” provisionally checks a 60-minute duration. Change these policies deliberately before launch. Travel and setup buffers are not automatically calculated; block them explicitly in a blocking calendar or extend the adapter.

## Request and approval sequence

The website submits through its own `/api/booking/requests` endpoint. It displays a spinner and acknowledges a tentative booking only after Google confirms receipt. Existing deployments can return an HTML confirmation. Visitors receive the decision by email. The booking records are accessible to the owner through the private booking sheet and calendar.

1. The frontend fetches availability after a date/timezone/duration is selected.
2. It permits a checked slot only after a successful response.
3. On submission, the backend validates the payload and rechecks availability.
4. It creates a private, transparent `[TENTATIVE] - Review Needed` calendar event with **no client attendee** and stores the request in the private Sheet.
5. An email goes to the artist with a seven-day, single-use approval link. Only a token hash is stored.
6. Opening that link only displays a review screen. The artist presses Approve or Decline; email-link scanners cannot approve through a GET request.
7. Approval rechecks for confirmed conflicts, updates the event to confirmed, adds the client and asks Google to send the invitation. Decline removes the tentative event and submits a client email notification.

Tentative requests are transparent, so multiple inquiries may concern the same slot. Only one can be approved without a confirmed conflict. A global script lock serializes decisions and request writes. The same form payload is deduplicated for ten minutes.

Keep approval links private; possession of a valid link grants the decision action. Expired requests stay in the Sheet/calendar for manual review; no automatic expiry cleanup is installed. Commercial terms, deposits and cancellation agreements remain a direct artist/client conversation.

## Artist reminders

Approved events request a one-hour Calendar popup reminder for the organizer. The hourly Apps Script job sends a separate email to `ARTIST_EMAIL` when an approved event is within the next 24 hours, once per request. It skips cancelled or unconfirmed events. Client reminder settings belong to the client’s Calendar account.

Reminder timing is approximate because Apps Script triggers run on an hourly schedule, not at an exact second. The owner should monitor Apps Script Executions and email quotas. The private Sheet’s `notification` and `reminderSent` fields help identify failures. Do not promise guaranteed email delivery.

## Live testing checklist

- Check one free slot and one busy slot; test a blocking personal calendar as well.
- Submit a request and verify the tentative event has no client attendee.
- Open the approval link without pressing a decision and verify nothing changes.
- Approve; verify the client receives the invitation and another overlapping request cannot be approved.
- Decline a different request; verify its event is removed and the decline email is delivered.
- Replay and expire an approval token; both must be rejected.
- Test the reminder job with an approved near-future event.
- Test the public `/exec?mode=availability...` response from the deployed website. If the account/deployment restricts cross-origin GET, use a same-origin server proxy; never use an opaque `no-cors` response and call it verified availability.

These Google operations are covered by local service mocks, but have not been executed against the artist’s account. No Google permission, calendar event, client invitation, reminder trigger or email delivery was activated by the agent.

## As the audience grows

A static portfolio plus Apps Script is a practical starting point with Google quotas and an intentionally conservative request cap. At higher volume, move the same frontend contract to a server backend with a database, durable idempotency, queue, CAPTCHA/rate limiting, retryable email delivery, authenticated manager dashboard, audit logs and monitoring. Fame or internet search does not authorize bookings or update data automatically.

Official references: [Apps Script web apps](https://developers.google.com/apps-script/guides/web), [advanced Calendar service](https://developers.google.com/apps-script/advanced/calendar), [Calendar event API](https://developers.google.com/workspace/calendar/api/v3/reference/events), [notification behavior](https://developers.google.com/workspace/calendar/api/concepts/reminders), [Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas).
