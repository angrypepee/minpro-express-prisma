const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bcrypt = require('bcrypt');
const yup = require('yup');

const app = express();
const prisma = new PrismaClient();
const port = 3001;

app.use(cors());
app.use(express.json());

// Yup schema for validation (matches your User model)
const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
}).required();

// GET /api/test-db (Database connection test)
app.get('/api/test-db', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ message: 'Database connected successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to connect to the database' });
  }
});

// POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const parsedBody = req.body;

    try {
      await schema.validate(parsedBody);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.errors });
    }

    const { name, email, password } = parsedBody;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ATTENDEE',
      },
    });

    res.status(201).json({ message: 'User created successfully', user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// GET /api/events
app.get('/api/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        organizer: true,
        tickets: true,
      },
    });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: { 
        event: true,
      },
    });
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// GET /api/attendees
app.get('/api/attendees', async (req, res) => {
  try {
    const attendees = await prisma.attendee.findMany({
      include: {
        user: true,
        event: true,
      },
    });
    res.json(attendees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attendees' });
  }
});

// GET /api/reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: true,
        event: true,
      },
    });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});