"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/config/navigation";
import { useSound } from "@/shared/audio/SoundProvider";
import Pressable from "@/shared/ui/Pressable";
import ThemeToggle from "@/shared/theme/ThemeToggle";
import MobileNavigation from "./MobileNavigation";
import Brand from "./Brand";
export default function Navbar() {
  const path = usePathname();
  const { enabled, toggleSound } = useSound();
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="siteHeader">
        <Brand />
        <nav className="desktopNavigation" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={path === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="navRight">
          <ThemeToggle />
          <Pressable
            className={`sound ${enabled ? "enabled" : ""}`}
            onClick={toggleSound}
            aria-pressed={enabled}
            aria-label={enabled ? "Turn sound off" : "Turn sound on"}
          >
            <i className="bars" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((i) => (
                <b key={i} style={{ animationDelay: `${i * 0.14}s` }} />
              ))}
            </i>
            <span>MUSIC {enabled ? "ON" : "OFF"}</span>
          </Pressable>
          <Link className="navBook" href="/book#booking-form">
            BOOK / APPOINTMENT ↗
          </Link>
          <Pressable
            className="menuToggle"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </Pressable>
        </div>
      </header>
      {open &&
        createPortal(
          <MobileNavigation path={path} onClose={() => setOpen(false)} />,
          document.body,
        )}
    </>
  );
}
