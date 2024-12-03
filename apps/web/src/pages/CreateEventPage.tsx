import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EventData {
  name: string;
  description: string;
  limit: number;
  date: string;
  location: string;
  ticketType: 'VIP' | 'GENERAL' | 'EARLY_BIRD';
  price: string;
}

export default function CreateEventPage() {
  const [eventData, setEventData] = useState<EventData>({
    name: '',
    description: '',
    limit: 70,
    date: '',
    location: '',
    ticketType: 'GENERAL',
    price: '',
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/create-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: eventData.name,
          description: eventData.description,
          limit: eventData.limit,
          date: eventData.date, // Ensure this is in the correct format
          location: eventData.location,
          ticketType: eventData.ticketType,
          price: parseFloat(eventData.price),
        }),
      });

      if (response.ok) {
        router.push('/profile'); // Redirect after event creation
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create event');
      }
    } catch (err) {
      console.error('Error creating event:', err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div>
      <h1>Create Event</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={eventData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Event Description"
          value={eventData.description}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="date"
          value={eventData.date}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Event Location"
          value={eventData.location}
          onChange={handleChange}
        />
        <select name="ticketType" value={eventData.ticketType} onChange={handleChange}>
          <option value="VIP">VIP</option>
          <option value="GENERAL">General</option>
          <option value="EARLY_BIRD">Early Bird</option>
        </select>
        <input
          type="number"
          name="price"
          placeholder="Ticket Price"
          value={eventData.price}
          onChange={handleChange}
        />
        <button type="button" onClick={handleSubmit}>
          Create Event
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
