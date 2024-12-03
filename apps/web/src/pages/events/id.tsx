// pages/events/[id].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
}

export default function EventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null);  // State to store event details
  const [error, setError] = useState<string | null>(null);  // State for error
  const router = useRouter();
  const { id } = router.query;  // Extract dynamic parameter from the URL

  useEffect(() => {
    const fetchEvent = async () => {
      // Make sure 'id' is available
      if (!id) {
        return;  // If the id is not available yet, don't attempt to fetch
      }

      try {
        const response = await fetch(`/api/events/${id}`);
        if (!response.ok) {
          setError('Failed to fetch event details');
          return;
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        setError('An error occurred while fetching the event details');
      }
    };

    fetchEvent();
  }, [id]);  // Only run the effect when 'id' changes

  if (error) return <div>Error: {error}</div>;
  if (!event) return <div>Loading...</div>;

  return (
    <div>
      <h1>{event.name}</h1>
      <p>{event.description}</p>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
    </div>
  );
}
