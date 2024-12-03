'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './EventsPage.css'; 

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);  // State for events
  const [error, setError] = useState<string | null>(null); // State for error
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const eventsData = await response.json();
          setEvents(eventsData);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('An unexpected error occurred');
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (eventId: number) => {
    router.push(`/events/${eventId}`);  // Navigate to event detail page
  };

  return (
    <div className="events-container">
      <h1>Event List</h1>
      {error && <p className="error">{error}</p>}

      <ul>
        {events.map((event) => (
          <li key={event.id} onClick={() => handleEventClick(event.id)} className="event-item">
            <h3>{event.name}</h3>
            <p>{event.description}</p>
            <p>Date: {new Date(event.date).toLocaleString()}</p>
            <p>Location: {event.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
