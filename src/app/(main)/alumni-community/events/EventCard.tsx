import { useSession } from "@/context/SessionProvider";
import { EventData } from "@/utils/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import hero100 from "@/assets/hero100.jpg";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";

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
    <Card className="h-[250px] overflow-hidden">
      <div className="flex h-full w-full">
        <div className="relative h-full w-1/3">
          {event.attachments.length > 0 ? (
            <Image
              src={event.attachments[0].url}
              alt={event.title}
              layout="fill"
              objectFit="cover"
              priority
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
            {event.date.toString() > new Date().toISOString() && (
              <div className="absolute right-0 top-4 hidden rounded-l-[8px] bg-primary px-2 py-1 md:flex">
                Upcoming
              </div>
            )}
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {event.description}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="mb-1 flex items-center text-sm capitalize text-gray-600">
              <MapPin size={16} className="mr-1 inline text-primary" />
              {event.location}
            </p>
            <p className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-1 inline text-primary" />
              {new Date(event.date).toDateString()}
            </p>
            <p className="flex items-center text-sm text-gray-600">
              <Clock size={16} className="mr-1 inline text-primary" />
              {event.time}
            </p>
          </div>
          <div className="absolute bottom-3 left-4">
            <Button
              className="mt-6 rounded-sm bg-black hover:bg-muted"
              size={"sm"}
            >
              {event.type}
            </Button>
          </div>
          <div className="absolute bottom-3 right-4">
            {event.registrationLink ? (
              <Link href={event.registrationLink}>
                <Button className="mt-6" size={"sm"}>
                  Register
                </Button>
              </Link>
            ) : (
              <Button>For All</Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
