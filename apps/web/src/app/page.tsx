// app/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import EventList from '@/components/Event'; 
import { Event } from '@prisma/client'; 

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen">
      <div className="container mx-auto p-8 text-white">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Meriah Event</h1>
          <p className="text-lg mb-8">
            Create unforgettable events with our easy-to-use platform.
          </p>
          <Link
            href="/register"
            className="bg-white hover:bg-gray-100 text-blue-500 font-bold py-2 px-4 rounded transition duration-300"
          >
            Get Started
          </Link>
        </div>

        {/* Upcoming Events Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> 
            {isLoading ? (
              <p>Loading events...</p>
            ) : error ? (
              <p className="text-red-500 col-span-full">{error}</p> 
            ) : (
              <EventList events={events} /> 
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <Image
              src="/event-image.jpg" 
              alt="Event Image"
              width={500}
              height={300}
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 md:ml-8 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">
              Bring Your Events to Life
            </h2>
            <p className="text-gray-200">
              Our platform provides all the tools you need to plan, promote,
              and execute successful events.
            </p>
            
            
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <Link
            href="/register"
            className="bg-white hover:bg-gray-100 text-blue-500 font-bold py-3 px-6 rounded transition duration-300"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </main>
  );
}