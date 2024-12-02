'use client';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  const logoUrl = '/logo/starbucks.png'; 
  const isLoggedIn = false; 
  const userName = 'John Doe'; 

  return (
    <header style={{ backgroundColor: '#3b82f6', padding: '1rem 20px ' }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap', 
        }}
      >
        <Link href="/">
          <Image
            src={logoUrl} 
            alt="Meriah Event Logo"
            width={40}
            height={10}
          />
        </Link>

        <nav style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
          <ul
            style={{
              display: 'flex',
              listStyleType: 'none',
              padding: 0,
              margin: 0,
              flexWrap: 'wrap',  // Wrap navigation items on smaller screens
              justifyContent: 'center',  // Center the navigation items on mobile
            }}
          >
            {!isLoggedIn && (
              <>
                <li style={{ marginRight: '1rem', marginBottom: '0.5rem' }}>
                  <Link href="/register" style={{ color: 'white', textDecoration: 'none' }}>
                    Register
                  </Link>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link href="/login" style={{ color: 'white', textDecoration: 'none' }}>
                    Login
                  </Link>
                </li>
              </>
            )}
            {isLoggedIn && (
              <li style={{ color: 'white', marginBottom: '0.5rem' }}>
                Welcome, {userName}!
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
