"use client";
import { SoundProvider } from "@/shared/audio/SoundProvider";
import { MusicDock } from "@/features/music";
import { ThemeProvider } from "@/shared/theme/ThemeProvider";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SoundEntrance from "./SoundEntrance";
export default function AppShell({ children }) {
  return (
    <ThemeProvider>
      <SoundProvider>
        <a className="skipLink" href="#main-content">
          Skip to content
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <MusicDock />
        <SoundEntrance />
      </SoundProvider>
    </ThemeProvider>
  );
}
