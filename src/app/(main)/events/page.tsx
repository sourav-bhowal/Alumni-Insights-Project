import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventsHeroSection from "./HeroSection";
import AddEventButton from "./AddEventButton";
import AllEvents from "./AllEvents";
import Reunions from "./Reunions";
import { Metadata } from "next";
import Webinars from "./Webinars";
import Workshops from "./Workshops";
import Seminars from "./Seminars";

// METADATA
export const metadata: Metadata = {
  title: "Events",
  description: "Find events to attend",
};

// EVENTS PAGE
export default function EventsPage() {
  return (
    <main className="w-full px-4 py-2">
      <EventsHeroSection />
      <div>
        <h2 className="mb-4 text-3xl font-semibold">Events Page</h2>
      </div>
      <div className="md:w-full">
        <Tabs defaultValue="all-events">
          <TabsList className="md:w-full">
            <TabsTrigger value="all-events" className="flex-1 text-center">
              All
            </TabsTrigger>
            <TabsTrigger value="reunions" className="flex-1 text-center">
              Reunions
            </TabsTrigger>
            <TabsTrigger value="webinars" className="flex-1 text-center">
              Webinars
            </TabsTrigger>
            <TabsTrigger value="workshops" className="flex-1 text-center">
              Workshops
            </TabsTrigger>
            <TabsTrigger value="seminars" className="flex-1 text-center">
              Seminars
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all-events">
            <AllEvents />
          </TabsContent>
          <TabsContent value="reunions">
            <Reunions />
          </TabsContent>
          <TabsContent value="webinars">
            <Webinars />
          </TabsContent>
          <TabsContent value="workshops">
            <Workshops />
          </TabsContent>
          <TabsContent value="seminars">
            <Seminars />
          </TabsContent>
        </Tabs>
      </div>
      {/* <AddEventButton /> */}
    </main>
  );
}
