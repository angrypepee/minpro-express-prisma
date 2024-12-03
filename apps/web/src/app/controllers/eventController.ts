import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createEvent = async (eventData: any, userId: string) => {
  const { name, description, limit, date, location, ticketType, price } = eventData;

  // Validate input fields
  if (!name || !description || !date || !location || !ticketType || !price) {
    throw new Error('Missing required fields');
  }

  // Parse and validate the date
  const eventDate = new Date(date);
  if (isNaN(eventDate.getTime())) {
    throw new Error('Invalid date format');
  }

  // Create the event in the database using Prisma
  const event = await prisma.event.create({
    data: {
      name,
      description,
      limit,
      date: eventDate, 
      location,
      image: "image-url-or-path",
      organizerId: Number(userId), 
      createAt: new Date(), 
      tickets: {
        create: [
          {
            type: ticketType,
            price: parseFloat(price), 
          },
        ],
      },
    },
  });

  return event;
};
