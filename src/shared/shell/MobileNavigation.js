"use client";
import Link from "next/link";
import Modal from "@/shared/ui/Modal";
import { navigation } from "@/config/navigation";
export default function MobileNavigation({ path, onClose }) {
  return (
    <Modal title="Explore the stage." onClose={onClose} className="mobileMenuDialog">
      <p className="mobileMenuEyebrow">RITIK / THE LIVE EXPERIENCE</p>
      <nav className="mobileMenuLinks" aria-label="Mobile navigation">
        {navigation.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={path === item.href ? "page" : undefined}
            onClick={onClose}
          >
            <span className="menuIndex">0{index + 1}</span>
            <strong>{item.label}</strong>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </nav>
      <Link
        className="primary mobileMenuBooking"
        href="/book#booking-form"
        onClick={onClose}
      >
        Book a show / appointment <span>↗</span>
      </Link>
      <p className="mobileMenuFooter">THE VOICE. THE STRINGS. THE STAGE.</p>
    </Modal>
  );
}
