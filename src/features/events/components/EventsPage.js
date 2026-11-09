import PageHeading from "@/shared/ui/PageHeading";
import EventList from "./EventList";
export default function EventsPage() {
  return (
    <section className="section">
      <PageHeading
        eyebrow="LIVE / FIND YOUR NEXT MOMENT"
        title={
          <>
            See you
            <br />
            <em>in the crowd.</em>
          </>
        }
        description="Public performances and upcoming live experiences. Private events are arranged directly."
      />
      <EventList />
    </section>
  );
}
