import { socials } from "@/config/socials";
export default function AboutSection() {
  return (
    <section id="about" className="section about">
      <div className="sectionTag">01 / THE ARTIST</div>
      <div>
        <h2>
          Not just a set.
          <br />
          <span>A shared feeling.</span>
        </h2>
        <p>
          From an intimate acoustic evening to a stage full of energy, Ritik brings voice,
          guitar and presence together. Bollywood favourites, indie melodies, and the kind
          of singalong that stays with you.
        </p>
        <a className="textLink" href={socials.instagram} target="_blank" rel="noreferrer">
          Meet @musicalritikofficiall ↗
        </a>
      </div>
      <div className="aboutStamp">
        VOICE
        <br />
        <span>×</span>
        <br />
        STRINGS
      </div>
    </section>
  );
}
