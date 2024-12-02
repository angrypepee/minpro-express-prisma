'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';


const BuyTicketPage = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const [event, setEvent] = useState({
    id: 1, // Replace with actual event ID if needed
    name: 'Konser Musik Akbar',
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
  });

  const [selectedTicketId, setSelectedTicketId] = useState(event.tickets[0]?.id); // Pre-select the first ticket
  const [quantity, setQuantity] = useState(1);

  const handleTicketChange = (event) => {
    setSelectedTicketId(parseInt(event.target.value));
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };

  const handleBuyTicket = () => {
    if (eventId && selectedTicketId) {
      router.push(`/checkout/${eventId}/${selectedTicketId}?quantity=${quantity}`);
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Buy Tickets</h1>

      {/* Event Information */}
      <div style={{ marginBottom: '2rem' }}>
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{event.name}</h2>
        <p>{event.location}</p>
        <p>{event.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p>{event.date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
        <p>Organized by: {event.organizer.name}</p>
      </div>

      {/* Ticket Selection */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Select Ticket Type:</h3>
        {event.tickets.map(ticket => (
          <div key={ticket.id}>
            <input
              type="radio"
              id={`ticket-${ticket.id}`}
              name="ticketType"
              value={ticket.id}
              checked={selectedTicketId === ticket.id}
              onChange={handleTicketChange}
            />
            <label htmlFor={`ticket-${ticket.id}`}>
              {ticket.type} - Rp {ticket.price.toLocaleString()}
            </label>
          </div>
        ))}
      </div>

      {/* Quantity Selection */}
      <div style={{ marginBottom: '2rem' }}>
        <label htmlFor="quantity">Quantity:</label>
        <select id="quantity" value={quantity} onChange={handleQuantityChange}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Buy Ticket Button */}
      <button onClick={handleBuyTicket} disabled={!selectedTicketId}>
        Buy Ticket
      </button>
    </main>
  );
};

export default BuyTicketPage;