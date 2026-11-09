import Image from "next/image";
import PageHeading from "@/shared/ui/PageHeading";
import Faq from "@/shared/ui/Faq";
import { bookingFaqs } from "@/config/artist";
import BookingForm from "./BookingForm";
export default function BookingPage() {
  return (
    <>
      <section className="section booking">
        <div>
          <PageHeading
            eyebrow="YOUR STAGE / OUR NEXT STORY"
            title={
              <>
                Let’s make
                <br />a little <em>noise.</em>
              </>
            }
            description="Live show, studio session, or a planning appointment. Tell us what you’re imagining."
          />
          <div className="bookingArt">
            <div className="bookingArtCopy">
              <small>YOUR MOMENT, LIVE</small>
              <strong>
                One stage.
                <br />
                Your story.
              </strong>
              <span>VOICE × STRINGS × YOU</span>
            </div>
            <Image
              src="/ritik-cutout.png"
              width={1072}
              height={1477}
              alt="Ritik with his guitar, ready for the stage"
            />
          </div>
          <div className="notice">
            <span>↗ ARTIST APPROVAL COMES FIRST</span>
            <p>
              All selected dates are tentative. Your slot will only be finalized once
              confirmed directly by Ritik.
            </p>
          </div>
          <div className="bookingProcess">
            <p>
              <b>01</b> Pick your experience and preferred date.
            </p>
            <p>
              <b>02</b> Share your details and review your request.
            </p>
            <p>
              <b>03</b> Send your inquiry; Ritik confirms the next step.
            </p>
          </div>
        </div>
        <BookingForm />
      </section>
      <Faq items={bookingFaqs} />
    </>
  );
}
