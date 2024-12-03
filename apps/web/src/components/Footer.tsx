'use client';

import Image from 'next/image';
import './Footer.css'; // Import the CSS file if you create a separate one

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left logo */}
        <div className="logo">
          <Image src="/logo/minpro.png" alt="Minpro Logo" width={40} height={40} />
        </div>

        {/* Right copyright text */}
        <div className="copyright">
          &copy; {new Date().getFullYear()} Minpro. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
