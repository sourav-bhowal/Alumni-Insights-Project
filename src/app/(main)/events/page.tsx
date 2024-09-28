import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventsHeroSection from "./HeroSection";
import AddEventButton from "./AddEventButton";

// EVENTS PAGE
export default function EventsPage() {
  return (
    <main className="w-full px-4 py-2">
      <EventsHeroSection />
      <div>
        <h2 className="mb-4 text-3xl font-semibold">Events Page</h2>
      </div>
      <div className="w-full">
        <Tabs defaultValue="all">
          <TabsList className="flex w-full">
            <TabsTrigger value="all" className="flex-1 text-center">
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
            <TabsTrigger value="conferences" className="flex-1 text-center">
              Conferences
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {/* <AllEvernts /> */}
          </TabsContent>
          <TabsContent value="reunions">
            {/* <Reunions /> */}
          </TabsContent>
          <TabsContent value="webinars">
            {/* <Webinars /> */}
          </TabsContent>
          <TabsContent value="workshops">
            {/* <Workshops /> */}
          </TabsContent>
          <TabsContent value="seminars">
            {/* <Seminars /> */}
          </TabsContent>
          <TabsContent value="conferences">
            {/* <Conferences /> */}
          </TabsContent>
        </Tabs>
      </div>
      <AddEventButton />
    </main>
  );
}
