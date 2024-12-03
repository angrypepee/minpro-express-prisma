'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import EventList from '../components/EventList';
import { Event } from '@prisma/client';
import TestComponent from '../components/TestComponents';
import './Page.css'; // Import the new CSS file

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
      <div className="container mx-auto p-8 text-black"> 
        {/* Hero Section */}
        <div className="hero-section">
          <h1>Meriah Event</h1>
          <p>Create unforgettable events with our easy-to-use platform.</p>
          <Link
            href="/register"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Get Started
          </Link>
        </div>

        {/* Call other Component */}
        <TestComponent />

        {/* Upcoming Event-bolction */}
        <div className="upcoming-events">
          <h2>Upcoming Events</h2>
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
        <div className="features-section">
          <div className="md:w-1/2">
            <Image
              src="/event-image.jpg"
              alt="Event Image"
              width={500}
              height={300}
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="features-text md:w-1/2 md:ml-8">
            <h2>Bring Your Events to Life</h2>
            <p>Our platform provides all the tools you need to plan, promote, and execute successful events.</p>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="cta-section">
          <h2>Ready to get started?</h2>
          <Link
            href="/register"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition duration-300"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </main>
  );
}
