'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const events = [
  {
    id: 1,
    name: 'Konser Musik Akbar',
    category: 'Music',
    date: new Date('2025-01-10T19:00:00'),
    location: 'Stadion Utama Gelora Bung Karno, Jakarta',
    description: 'Festival musik sehari penuh menampilkan artis-artis internasional dan lokal terbaik. Akan ada penampilan dari Raisa, NOAH, dan bintang tamu spesial dari Korea Selatan!',
    image: '/banner/event.webp',
    limit: 50000,
    organizerId: 1,
    createAt: new Date(),
    organizer: {
      id: 1,
      name: 'Soundrenaline'
    },
    tickets: [
      { id: 1, price: 100000, type: 'Regular' },
      { id: 2, price: 250000, type: 'VIP' }
    ]
  },
  {
    id: 2,
    name: 'Konferensi Teknologi Indonesia',
    category: 'Technology',
    date: new Date('2025-02-25T08:00:00'),
    location: 'Jakarta Convention Center, Jakarta',
    description: 'Konferensi teknologi terkemuka dengan pembicara utama dan lokakarya. Temukan teknologi terbaru dan tercanggih di Indonesia!',
    image: '/banner/event.webp',
    limit: 1000,
    organizerId: 2,
    createAt: new Date(),
    organizer: {
      id: 2,
      name: 'IndoTech'
    },
    tickets: [
      { id: 3, price: 0, type: 'Free' }
    ]
  },
  {
    id: 3,
    name: 'Festival Kuliner Nusantara',
    category: 'Food',
    date: new Date('2025-03-15T10:00:00'),
    location: 'Taman Menteng, Jakarta',
    description: 'Perayaan kelezatan kuliner dengan berbagai stan makanan dan demonstrasi memasak. Nikmati hidangan khas dari seluruh Indonesia!',
    image: '/banner/event.webp',
    limit: 10000,
    organizerId: 3,
    createAt: new Date(),
    organizer: {
      id: 3,
      name: 'Kuliner Indonesia'
    },
    tickets: [
      { id: 4, price: 50000, type: 'Regular' }
    ]
  },
  {
    id: 4,
    name: 'Pameran Seni Rupa Kontemporer',
    category: 'Art',
    date: new Date('2025-04-05T09:00:00'),
    location: 'Museum Nasional Indonesia, Jakarta',
    description: 'Pameran seni rupa modern dan kontemporer dari seluruh Indonesia. Temukan karya seni inspiratif dari seniman-seniman berbakat!',
    image: '/banner/event.webp',
    limit: 5000,
    organizerId: 4,
    createAt: new Date(),
    organizer: {
      id: 4,
      name: 'Seni Rupa Indonesia'
    },
    tickets: [
      { id: 5, price: 25000, type: 'Regular' }
    ]
  },
  {
    id: 5,
    name: 'Pertunjukan Stand-Up Comedy',
    category: 'Comedy',
    date: new Date('2025-05-20T20:00:00'),
    location: 'Gedung Kesenian Jakarta, Jakarta',
    description: 'Malam penuh tawa dengan para komika stand-up ternama. Tertawa lepas dan hilangkan penat bersama komika favorit Indonesia!',
    image: '/banner/event.webp',
    limit: 2000,
    organizerId: 5,
    createAt: new Date(),
    organizer: {
      id: 5,
      name: 'Komunitas Stand-Up Indo'
    },
    tickets: [
      { id: 6, price: 75000, type: 'Regular' }
    ]
  },
  {
    id: 6,
    name: 'Turnamen Olahraga Nasional',
    category: 'Sports',
    date: new Date('2025-06-10T07:00:00'),
    location: 'Stadion Gelora Sriwijaya, Palembang',
    description: 'Turnamen olahraga nasional dengan atlet-atlet terbaik dari seluruh Indonesia. Saksikan pertandingan seru dan dukung atlet favoritmu!',
    image: '/banner/event.webp',
    limit: 15000,
    organizerId: 6,
    createAt: new Date(),
    organizer: {
      id: 6,
      name: 'Kementrian Olahraga'
    },
    tickets: [
      { id: 7, price: 100000, type: 'Regular' }
    ]
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearchTerm =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || event.category === selectedCategory;

    return matchesSearchTerm && matchesCategory;
  });

  return (
    <main style={{
      background: 'linear-gradient(to bottom, #3b82f6, #9333ea)',
      minHeight: '100vh',
      fontFamily: 'sans-serif'
    }}>

      {/* Banner Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: '0 0 2rem 0 '
      }}>
        <div style={{ maxWidth: '1200px', width: '100%' }}>
          <Image
            src="/banner/event.jpg"
            alt="Event Platform Banner"
            width={1200}
            height={400}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          />
        </div>
      </div>


      {/* Event Listing Section */}
      <section style={{ padding: '2rem 0rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          {/* Title */}
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            margin: 0,
          }}>
            Upcoming Events
          </h2>

          {/* Menu (Search Bar and Category) */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                marginRight: '1rem',
              }}
            />

            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
            >
              <option value="All">All Categories</option>
              <option value="Music">Music</option>
              <option value="Technology">Technology</option>
              <option value="Food">Food</option>
              <option value="Art">Art</option>
              <option value="Comedy">Comedy</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem'}}>
          {filteredEvents.map((event) => (
            <div key={event.id} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              {/* Event Information */}
              <Image
                src={event.image}
                alt={event.name}
                width={400}
                height={200}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  marginBottom: '1rem',
                  borderRadius: '4px'
                }}
              />

              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
                {event.name}
              </h3>

              <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                {event.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long',year: 'numeric'
                })}
              </p>

              <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem'}}>
                {event.date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit'})}
              </p>

              <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                {event.location}
              </p>

              <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem'}}>
                {event.description}
              </p>

              {/* Ticket Information */}
              {event.tickets.map(ticket => (
                <p key={ticket.id} style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold', marginBottom: '0.5rem'}}>
                  {ticket.type}: {ticket.price === 0 ? 'Gratis' : `Rp ${ticket.price.toLocaleString()}`}
                </p>
              ))}

              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '1rem'
              }}>
                Organizer: {event.organizer.name}
              </p>

              {/* Buy Ticket Buttons */}
              {event.tickets.map(ticket => (
                <Link
                  key={ticket.id}
                  href={`/ticket/${event.id}/${ticket.id}`}
                  style={{
                    backgroundColor: ticket.price === 0 ? '#ccc' : 'white',
                    color: ticket.price === 0 ? '#666' : '#9333ea',
                    fontWeight: 'bold',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    display: 'inline-block',
                    marginTop: '1rem',
                    cursor: ticket.price === 0 ? 'not-allowed' : 'pointer',
                    marginRight: '0.5rem'
                  }}
                >
                  {ticket.type} - {ticket.price === 0 ? 'Gratis' : `Rp ${ticket.price.toLocaleString()}`}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}