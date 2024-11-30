// app/events/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 

interface EventData {
  name: string;
  date: string; 
  location: string;
  description: string;
  limit: number;
  image: string; 
}

export default function CreateEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<EventData>({
    name: '',
    date: '',
    location: '',
    description: '',
    limit: 0, 
    image: '', 
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to create an event.');
        return;
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Event created successfully
        router.push('/events'); // Redirect to the events page (you'll need to create this page)
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create event.');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div>
      <h1>Create New Event</h1>
      {error && <div className="text-red-500">{error}</div>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        {/* ... your input fields for name, date, location, description, limit, image ... */}
        {/* Example input field for name */}
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        {/* ... other input fields ... */}
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}