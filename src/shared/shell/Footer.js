import Link from "next/link";
import Brand from "./Brand";
import { socials } from "@/config/socials";
import ExternalLink from "@/shared/ui/ExternalLink";
export default function Footer() {
  return (
    <footer className="siteFooter">
      <Brand />
      <div className="footerLinks">
        <Link href="/book#booking-form">Book a show</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/press">Press kit</Link>
        <Link href="/privacy">Privacy</Link>
        <ExternalLink href={socials.instagram}>Instagram ↗</ExternalLink>
      </div>
      <small>© {new Date().getFullYear()} RITIK</small>
    </footer>
  );
}
