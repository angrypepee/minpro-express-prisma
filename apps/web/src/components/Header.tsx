'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import './Header.css';

export function Header() {
  const [logoUrl, setLogoUrl] = useState('/logo/minpro.png');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    // Simulate fetching logo randomly
    const getRandomNumber = () => Math.floor(Math.random() * 3) + 1;
    setLogoUrl(`/logo${getRandomNumber()}.png`);

    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetch('/api/profile', {
        credentials: 'include', // Include cookies
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.name) setUserName(data.name);
        })
        .catch(() => {
          setIsLoggedIn(false); // If error, log out
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserName('');
    setShowProfileMenu(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link href="/" className="logo-link">
            <Image src='/logo/minpro.png' alt="Logo" width={30} height={30} />
            <h1>Minpro</h1>
          </Link>
        </div>

        <nav className="nav">
          <ul className="nav-links">
            <li>
              <Link href="/event" className="nav-link">
                Event
              </Link>
            </li>
            <li>
              <Link href="/about" className="nav-link">
                About
              </Link>
            </li>
            {!isLoggedIn ? (
              <>
                <li>
                  <Link href="/register" className="nav-link">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="nav-link">
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <li
                className="nav-link profile-menu"
                onMouseEnter={() => setShowProfileMenu(true)}
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                Welcome, {userName}!
                {showProfileMenu && (
                  <ul className="profile-dropdown">
                    <li>
                      <Link href="/profile" className="profile-link">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        className="logout-button"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
