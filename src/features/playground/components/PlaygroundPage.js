import PageHeading from "@/shared/ui/PageHeading";
import SoundPads from "./SoundPads";
import StepSequencer from "./StepSequencer";
import { GuitarStrings } from "@/features/music";
export default function PlaygroundPage() {
  return (
    <div className="section playground">
      <PageHeading
        eyebrow="THE PLAYGROUND / NO WRONG NOTES"
        title={
          <>
            Don’t just listen.
            <br />
            <em>Make something.</em>
          </>
        }
        description="A tiny studio for your curiosity. Play a melody, build a loop, or get lost in six strings."
      />
      <SoundPads />
      <StepSequencer />
      <div className="playgroundGuitar">
        <div className="sectionTag">03 / THE ACOUSTIC CORNER</div>
        <h2>Back to the strings.</h2>
        <GuitarStrings />
      </div>
    </div>
  );
}
