// components/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function Header() {
  const [logoUrl, setLogoUrl] = useState('/logo1.png');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userName, setUserName] = useState(''); 

  useEffect(() => {
    const getRandomNumber = () => Math.floor(Math.random() * 3) + 1;
    setLogoUrl(`/logo${getRandomNumber()}.png`);

    // Check if the user is logged in (you might need to adjust this logic)
    const token = localStorage.getItem('token'); // Or get the token from a cookie
    if (token) {
      setIsLoggedIn(true);
      // TODO: Fetch user data from API and set the userName
      fetch('/api/user', { // Replace with your API endpoint for fetching user data
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => res.json())
      .then(data => setUserName(data.name)); // Assuming the API response has a 'name' field
    }
  }, []);

  return (
    <header className="bg-blue-500 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* ... your logo ... */}
        <nav>
          <ul className="flex space-x-4">
            {!isLoggedIn && ( // Conditionally render login/register links
              <>
                <li>
                  <Link href="/register" className="text-white hover:text-gray-200">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-white hover:text-gray-200">
                    Login
                  </Link>
                </li>
              </>
            )}
            {isLoggedIn && ( // Conditionally render user name
              <li className="text-white">
                Welcome, {userName}!
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}