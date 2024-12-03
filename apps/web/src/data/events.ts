// data/events.ts
export interface Ticket {
    id: number;
    price: number;
    type: string;
  }
  
  export interface Organizer {
    id: number;
    name: string;
  }
  
  export interface Event {
    id: number;
    name: string;
    category: string;
    date: Date;
    location: string;
    description: string;
    image: string;
    limit: number;
    organizerId: number;
    createAt: Date;
    organizer: Organizer;
    tickets: Ticket[];
  }
  
  // Sample events data
  export const events = [
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