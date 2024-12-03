// pages/about.tsx
import React from 'react';
import Link from 'next/link';
import './about.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About MinPro Event</h1>
      </div>
      <div className="about-content">
        <p>
          Welcome to MinPro Event! We are your go-to platform for discovering exciting events in various categories such as music, arts, business, and more. Whether you're looking for something fun or professional, MinPro Event has something for everyone.
        </p>
        <p>
          Our mission is to provide an easy-to-use platform that connects people to local events and experiences that matter to them. Stay up to date with the latest happenings, discover new interests, and never miss out on an event again.
        </p>
      </div>
      <div className="about-footer">
        <Link href="/">
          <a className="back-to-home">Back to Home</a>
        </Link>
      </div>
    </div>
  );
};

export default About;
