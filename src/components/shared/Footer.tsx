"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Mail, SearchIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mx-4 space-y-10">
      <div className="h-px flex-1 bg-muted" />
      <div className="rounded-2xl bg-card py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Get in Touch */}
            <div>
              <h2 className="mb-4 text-2xl font-bold">Get in Touch</h2>
              <p className="mb-2">8014 Edith Blvd NE, Albuquerque, New York,</p>
              <p className="mb-4">United States</p>
              <p className="mb-2">(505) 792-2430</p>
              <p className="mb-4">demo@yourdomain.com</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-gray-300">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className="hover:text-gray-300">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="hover:text-gray-300">
                  <Facebook className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h2 className="mb-4 text-2xl font-bold">Services</h2>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Internships
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Mentorship
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Forums
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Connect
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h2 className="mb-4 text-2xl font-bold">Company</h2>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-gray-300">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Help Centre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Terms & Services
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Our Newsletter */}
            <div>
              <h2 className="mb-4 text-2xl font-bold">Our Newsletter</h2>
              <p className="mb-4">
                Subscribe to our newsletter to get our news & discounts
                delivered to you.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 transform text-primary" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="h-11 rounded-full pl-10"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full bg-orange-500 text-white hover:bg-primary"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="h-px flex-1 bg-muted" />
    </footer>
  );
}
