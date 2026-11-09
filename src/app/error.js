"use client";
import Link from "next/link";
export default function ErrorPage({ reset }) {
  return (
    <section className="section">
      <h1>A brief intermission.</h1>
      <p>Something interrupted this page. Try again or return to the artist.</p>
      <div className="actions">
        <button className="primary" onClick={reset}>
          Try again ↗
        </button>
        <Link className="textLink" href="/">
          Back home
        </Link>
      </div>
    </section>
  );
}
