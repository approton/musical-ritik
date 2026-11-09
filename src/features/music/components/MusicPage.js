import PageHeading from "@/shared/ui/PageHeading";
import GuitarStrings from "./GuitarStrings";
import MusicLibrary from "./MusicLibrary";
export default function MusicPage() {
  return (
    <div className="section">
      <PageHeading
        eyebrow="THE SOUND / UP CLOSE"
        title={
          <>
            Six strings.
            <br />
            <em>Endless possibilities.</em>
          </>
        }
        description="A little taste of the instrument. Tap a string, play the soundcheck, then explore the music."
      />
      <GuitarStrings />
      <MusicLibrary />
    </div>
  );
}
