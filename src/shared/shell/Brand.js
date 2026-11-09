import Link from "next/link";
export default function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Ritik home">
      ritik<span>↗</span>
      <small>THE LIVE EXPERIENCE</small>
    </Link>
  );
}
