import Image from "next/image";
import Link from "next/link";
import PageHeading from "@/shared/ui/PageHeading";
import { artist } from "@/config/artist";
import PressDownloads from "./PressDownloads";
export default function PressPage() {
  return (
    <section className="section">
      <PageHeading
        eyebrow="THE PRESS KIT / FOR YOUR NEXT STAGE"
        title={
          <>
            The artist.
            <br />
            <em>The essentials.</em>
          </>
        }
        description="Artist information and a performance photo for event planning and media enquiries."
      />
      <div className="pressGrid">
        <Image
          src="/ritik-live.jpeg"
          width={1170}
          height={1273}
          alt="Ritik performing with his guitar"
        />
        <div>
          <h2>{artist.name}</h2>
          <p>{artist.bio}</p>
          <PressDownloads />
          <div className="panel">
            <h3>Production conversation</h3>
            <p>
              Share your stage dimensions, PA and monitor setup, microphones, power
              access, load-in time and soundcheck window. The final technical requirements
              are agreed for each performance.
            </p>
            <Link className="textLink" href="/contact">
              Discuss production & press ↗
            </Link>
          </div>
        </div>
      </div>
      <div className="sectionTag serviceLabel">PERFORMANCE FORMATS</div>
      <div className="serviceGrid">
        {artist.services.map((service) => (
          <article className="panel" key={service.id}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <Link className="textLink" href="/book">
              Enquire ↗
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
