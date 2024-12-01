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

    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);

      fetch('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => setUserName(data.name))
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, []);

  return (
    <header className="bg-blue-500 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo/starbucks.png"
            alt="Meriah Event Logo"
            width={40}
            height={10}
          />
        </Link>
        <nav>
          <ul className="flex space-x-4">
            {!isLoggedIn && (
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
            {isLoggedIn && (
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