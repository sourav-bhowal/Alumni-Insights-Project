"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import exploreImage from "@/assets/exp1.jpg";

const exploreItems = [
  {
    title:
      "Reconnect with old classmates, discover new professional connections, and be part of a vibrant alumni community.",
    link: "/beaches",
    btn: "Join Us",
  },
  {
    title:
      "Your contributions help fund scholarships, campus improvements, and special projects that benefit current and future students.",
    link: "/mountains",
    btn: "Donate Today",
  },
  {
    title:
      "Whether you’re looking to hire, seeking a new role our job portal connects you with valuable resources within our alumni network.",
    link: "/cities",
    btn: "Find Jobs",
  },
  {
    title:
      "Reconnect with old classmates, discover new professional connections, and be part of a vibrant alumni community.",
    link: "/forests",
    btn: "Join Us",
  },
  {
    title:
      "Your contributions help fund scholarships, campus improvements, and special projects that benefit current and future students.",
    link: "/deserts",
    btn: "Donate Today",
  },
  {
    title:
      "Whether you’re looking to hire, seeking a new role our job portal connects you with valuable resources within our alumni network.",
    link: "/islands",
    btn: "Find Jobs",
  },
];

export default function ExploreSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full py-12">
      <div className="container min-w-full">
        <h2 className="mb-4 text-center text-5xl font-bold tracking-wider">
          EXPLORE
        </h2>
        <div className="relative">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="scrollbar-hide flex w-full space-x-4 overflow-x-auto pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {exploreItems.map((item, index) => (
              <div key={index} className="w-[300px] flex-none">
                <div className="relative h-[500px] overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80" />
                  <Image
                    src={exploreImage}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
                    <h3 className="mb-2 text-center text-xl font-bold">
                      {item.title}
                    </h3>
                    <Button
                      variant="secondary"
                      asChild
                      className="mt-5 rounded-full border-2 border-primary bg-card w-[120px]"
                    >
                      <a href={item.link}>{item.btn}</a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            className={`absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 ${
              canScrollLeft ? "visible" : "invisible"
            }`}
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Scroll left</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 ${
              canScrollRight ? "visible" : "invisible"
            }`}
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
