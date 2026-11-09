import PageHeading from "@/shared/ui/PageHeading";
export const metadata = { title: "Privacy" };
export default function PrivacyPage() {
  return (
    <section className="section legal">
      <PageHeading eyebrow="YOUR INFORMATION" title="A little clarity." />
      <h2>Contact & booking details</h2>
      <p>
        Forms first prepare your inquiry in your browser. When you consent and press Send,
        your name, contact details and message are sent through FormSubmit to Ritik.
        FormSubmit may ask for a CAPTCHA and recipient activation.
      </p>
      <p>
        If the Google booking service is configured, booking requests go to an
        artist-owned Google Apps Script service, private booking Sheet and Calendar. The
        artist receives an approval email. A client invite is issued only after approval.
        Free/busy availability exposes start times, never private event titles or guest
        details.
      </p>
      <h2>Local drafts</h2>
      <p>
        Booking drafts are saved only when you choose Save tab draft. They use session
        storage in that browser tab. Clear draft removes them. Closing the tab normally
        clears its session.
      </p>
      <h2>Sound & external services</h2>
      <p>
        Licensed background recordings are served by this site. Sound starts after you
        choose to enable it. The playground synthesizes notes locally and never requests
        microphone access. Instagram and email links open external services governed by
        their own policies.
      </p>
      <p>
        Fonts may load from Google Fonts. A connected public shows feed loads only
        published show information. The hosting provider may process ordinary request
        logs. No analytics or marketing cookies are intentionally added by this app.
      </p>
    </section>
  );
}
