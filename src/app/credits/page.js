import PageHeading from "@/shared/ui/PageHeading";
import ExternalLink from "@/shared/ui/ExternalLink";
import { soundtrack } from "@/config/soundtrack";
export const metadata = { title: "Music credits" };
export default function CreditsPage() {
  return (
    <section className="section">
      <PageHeading
        eyebrow="THE SOUNDTRACK / WITH CREDIT"
        title={
          <>
            A mood.
            <br />
            <em>Many musicians.</em>
          </>
        }
        description="The background playlist features these licensed instrumental recordings. These are not recordings by Ritik."
      />
      <div className="serviceGrid">
        {soundtrack.map((track) => (
          <article className="panel" key={track.id}>
            <div className="sectionTag">{track.instrument}</div>
            <h2>{track.title}</h2>
            <p>{track.artist}</p>
            <p>
              Official MP3 transcode; the performance is otherwise unchanged. Playback
              volume is adjustable. The Vivaldi composition is by Antonio Vivaldi; the
              performance recording is credited above.
            </p>
            <ExternalLink href={track.source}>Original recording ↗</ExternalLink>
            <br />
            <ExternalLink href={track.licenseUrl}>{track.license} ↗</ExternalLink>
            <audio controls preload="none" src={track.src} aria-label={track.title} />
          </article>
        ))}
      </div>
    </section>
  );
}
