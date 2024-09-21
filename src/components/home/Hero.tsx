import { Button } from "@/components/ui/button";
import Image from "next/image";
import heroImage from "@/assets/hero.jpg";

// HERO SECTION
export default function HeroSection() {
  return (
    <section className="relative flex h-[80%] min-w-full items-center justify-center overflow-hidden rounded-lg">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Graduate holding cap and diploma"
          className="h-full w-full object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-6 space-y-2 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
          <p>Connect, Contribute and </p>
          <p>Thrive with Your Alma Mater</p>
        </h1>
        <Button
          size="lg"
          className="mt-10 rounded-lg border-2 border-primary bg-card text-black dark:text-white hover:bg-primary/90"
        >
          Explore Community
        </Button>
      </div>
    </section>
  );
}
