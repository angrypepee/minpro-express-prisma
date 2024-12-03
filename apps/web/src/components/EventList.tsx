// components/EventList.tsx
'use client';

import React from 'react';
import { Event as EventType } from '@prisma/client'; // Import the Event type from your Prisma schema
import Link from 'next/link'; 
import Image from 'next/image';

interface EventListProps {
  events: EventType[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {events.map(event => (
        <Link key={event.id} href={`/events/${event.id}`} className="block"> 
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image
                src={event.image || '/placeholder-image.jpg'} // Use a placeholder if the event doesn't have an image
                alt={event.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{event.name}</h3>
              <p className="text-gray-600 text-sm">
                {new Date(event.date).toLocaleDateString()} - {event.location}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default EventList;