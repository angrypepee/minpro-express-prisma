'use client';
import Image from 'next/image';
import Link from 'next/link';
const logoUrl = '/logo/starbucks.png'; 

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#1f2937', padding: '2rem 0', color: 'white' }}>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Link href="/">
          <Image
            src={logoUrl} 
            alt="Meriah Event Logo"
            width={60}
            height={15}
          />
        </Link>
        
        <div> 
          <p style={{ fontSize: '0.875rem' }}> 
            Meriah Event - Your Event Management Platform
          </p>
          <p style={{ fontSize: '0.75rem' }}>
            &copy; 2024 minpro. All rights reserved. 
          </p>
        </div>

      </div>
    </footer>
  );
};
