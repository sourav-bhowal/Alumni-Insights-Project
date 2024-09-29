import { useSession } from "@/context/SessionProvider";
import { EventData } from "@/utils/types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import hero100 from "@/assets/hero100.jpg";

// INTERFACE FOR EVENTCARD
interface EventCardProps {
  event: EventData;
}

// EVENT CARD
export default function EventCard({ event }: EventCardProps) {
  // GET LOGGED IN USER
  const { user: loggedInUser } = useSession();
  // JSX
  return (
    <Card className="h-[200px] overflow-hidden">
      <div className="flex h-full w-full">
        <div className="relative h-full w-1/3">
          {event.attachments.length > 0 ? (
            <Image
              src={event.attachments[0].url}
              alt={event.title}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <Image
              src={hero100}
              alt={event.title}
              layout="fill"
              objectFit="cover"
            />
          )}
        </div>
        <CardContent className="relative w-2/3 p-4">
          <div className="w-full">
            <h2 className="mb-1 text-2xl font-bold">{event.title}</h2>
            {new Date(event.date).toDateString() >
              new Date().toDateString() && (
              <div className="absolute right-0 top-4 hidden rounded-l-[8px] bg-primary px-2 py-1 md:flex">
                Upcoming
              </div>
            )}
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {event.description}
            </p>
          </div>
          <p className="mb-1 text-sm text-gray-600">{event.location}</p>
          <p className="text-sm text-gray-600">
            {new Date(event.date).toDateString()}
          </p>
          <p className="text-sm text-gray-600">{event.time}</p>
        </CardContent>
      </div>
    </Card>
  );
}
