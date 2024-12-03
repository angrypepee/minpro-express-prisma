'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ORGANIZER'; // Add other roles if needed
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
          <p>Welcome, organizer! Here are your tools:</p>
          <ul>
            <li>Event Management</li>
            <li>Attendee Insights</li>
            <li>Revenue Reports</li>
          </ul>
        </div>
      )}
    </div>
  );
}
