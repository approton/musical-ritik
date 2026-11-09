import Link from "next/link";
import { socials } from "@/config/socials";
import PageHeading from "@/shared/ui/PageHeading";
import ExternalLink from "@/shared/ui/ExternalLink";
import ContactComposer from "./ContactComposer";
export default function ContactPage() {
  return (
    <section className="section contactLayout">
      <div>
        <PageHeading
          eyebrow="CONTACT / LET’S CONNECT"
          title={
            <>
              Good things start
              <br />
              with <em>hello.</em>
            </>
          }
          description="For collaborations, music conversations, press, and everything between the notes."
        />
        <div className="contactChannels">
          <ExternalLink href={socials.instagram}>
            <small>DIRECT MESSAGE</small>
            <strong>@musicalritikofficiall ↗</strong>
          </ExternalLink>
          {socials.email && (
            <a href={`mailto:${socials.email}`}>
              <small>EMAIL</small>
              <strong>{socials.email} ↗</strong>
            </a>
          )}
          <Link href="/book">
            <small>LIVE SHOW / STUDIO / APPOINTMENT</small>
            <strong>Plan an experience ↗</strong>
          </Link>
          <Link href="/press">
            <small>FOR PROMOTERS & MEDIA</small>
            <strong>Artist press kit ↗</strong>
          </Link>
        </div>
      </div>
      <ContactComposer />
    </section>
  );
}
