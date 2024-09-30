"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import python from "@/assets/python.jpg";
import hero100 from "@/assets/hero100.jpg";
import coding from "@/assets/coding.jpg";

// Array of hero images with src and title
const heroImages = [
  {
    src: python,
    title: "Hands-on tutorial with Python for Data Science",
  },
  {
    src: hero100,
    title: "15th Year Alumni Reunion 2009 Batch",
  },
  {
    src: coding,
    title: "Coding Bootcamp for Beginners with Python",
  },
  {
    src: hero100,
    title: "Introduction to Machine Learning with Python",
  },
  {
    src: hero100,
    title: "Web Development Bootcamp with React",
  },
  {
    src: hero100,
    title: "Natural Language Processing with Python",
  },
];

// HeroSection component
export default function EventsHeroSection() {
  // State to keep track of the current hero image index
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  // UseEffect to change the hero image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);
  // Return the hero section with hero images and buttons
  return (
    <div className="relative mb-8 h-[400px] overflow-hidden rounded-xl sm:h-[600px]">
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentHeroIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image src={image.src} alt={image.title} className="object-fill" />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <h1 className="max-w-xs text-center text-3xl font-bold text-white sm:max-w-4xl sm:text-6xl">
              {image.title}
            </h1>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full ${
              index === currentHeroIndex ? "bg-white" : "bg-gray-400"
            }`}
            onClick={() => setCurrentHeroIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
