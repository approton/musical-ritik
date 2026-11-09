import "./globals.css";
import AppShell from "@/shared/shell/AppShell";
export const metadata = {
  title: { default: "Ritik | The Voice, The Strings, The Stage", template: "%s | Ritik" },
  description:
    "Live vocalist, acoustic and electric guitarist. Explore the music, discover live moments, and plan your next show with Ritik.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
