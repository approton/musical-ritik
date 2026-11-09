import Link from "next/link";
import PageHeading from "@/shared/ui/PageHeading";
export default function NotFound() {
  return (
    <section className="section">
      <PageHeading
        eyebrow="404 / A MISSED NOTE"
        title={
          <>
            Let’s find
            <br />
            <em>the way back.</em>
          </>
        }
        description="This page isn’t part of the set list."
      />
      <Link href="/" className="primary">
        Back to the artist ↗
      </Link>
    </section>
  );
}
