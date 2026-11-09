import Link from "next/link";
export default function ExperienceLinks() {
  return (
    <section className="section homeNext">
      <div className="sectionTag">MAKE IT YOUR EXPERIENCE</div>
      <div className="featureLinks">
        {[
          [
            "/music",
            "01",
            "Explore the sound",
            "Playable strings, demos and listening links.",
          ],
          ["/gallery", "02", "Get closer", "Live photographs and Instagram reels."],
          [
            "/book",
            "03",
            "Bring it to your stage",
            "Plan a live show, studio session or appointment.",
          ],
        ].map(([href, n, title, description]) => (
          <Link href={href} key={href}>
            <small>{n} /</small>
            <h3>{title} ↗</h3>
            <p>{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
