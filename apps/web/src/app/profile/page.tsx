'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './ProfilePage.css'; // Import the CSS file

interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ORGANIZER'; // Add other roles if needed
}

interface Event {
  id: number;
  name: string;
  description: string;
  date: string; // Adjust this type based on how you store the date
  location: string;
  limit: number;
  tickets: { type: string; price: number }[];
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]); // State to hold events
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventFetchError, setEventFetchError] = useState<string | null>(null); // State for event fetch error
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile', {
          method: 'GET',
          credentials: 'include', // Ensures cookies are sent with the request
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);

          // If user is an organizer, fetch events related to them
          if (userData.role === 'ORGANIZER') {
            await fetchEvents(userData.id); // Fetch events based on organizer ID
          }
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch profile');
          router.push('/login'); // Redirect to login if unauthorized
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('An unexpected error occurred');
        router.push('/login'); // Redirect to login on error
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Fetch events for the organizer
  const fetchEvents = async (userId: number) => {
    try {
      const response = await fetch(`/api/events?organizerId=${userId}`);
      if (response.ok) {
        const eventsData = await response.json();
        setEvents(eventsData); // Set events based on organizer
        if (eventsData.length === 0) {
          setEventFetchError('No events found.');
        }
      } else {
        setEventFetchError('Failed to fetch events.');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEventFetchError('An error occurred while fetching events.');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login'); // Redirect to login page after logout
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to log out');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      alert('An error occurred during logout');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="profile-container">
      <h1>Welcome, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>

      {user?.role === 'USER' && (
        <div>
          <h2>User Dashboard</h2>
          <p>You have access to user-specific features.</p>
        </div>
      )}

      {user?.role === 'ORGANIZER' && (
        <div>
          <h2>Organizer Dashboard</h2>
          <p>Welcome, organizer! Here are your events:</p>

          {eventFetchError ? (
            <p className="event-error">{eventFetchError}</p> // Show event fetch error
          ) : (
            <ul>
              {events.length > 0 ? (
                events.map((event) => (
                  <li key={event.id}>
                    <h3>{event.name}</h3>
                    <p>{event.description}</p>
                    <p>Location: {event.location}</p>
                    <p>Date: {new Date(event.date).toLocaleString()}</p>
                    <p>Limit: {event.limit}</p>
                    <h4>Tickets:</h4>
                    <ul>
                      {event.tickets.map((ticket, index) => (
                        <li key={index}>
                          {ticket.type} - ${ticket.price}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))
              ) : (
                <p>No events available.</p>
              )}
            </ul>
          )}
        </div>
      )}

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
