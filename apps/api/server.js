const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bcrypt = require('bcrypt');
const yup = require('yup');
const jwt = require('jsonwebtoken');

import { authMiddleware } from './middleware/authmiddleware';

const app = express();
const prisma = new PrismaClient();
const port = 3001;

app.use(cors());
app.use(express.json());

// Yup schema for validation
const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(8,   
 'Password must be at least 8 characters').required('Password is required'),   

}).required();

// GET /api/test-db
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

    const { name, email, password, role } = parsedBody;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists'   
 });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,   

        role: role,
      },
    });

    res.status(201).json({ message: 'User created successfully', user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user'   
 });
  }
});

// Secret key for JWT (get it from the environment variable)
const jwtSecretKey = process.env.JWT_SECRET_KEY || 'j1J1VEgOQjl1NtmZftCA8YOxQOHjKRXM6MoNPvPb29s='; 

// POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({   
 error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({   
 error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id   
 }, jwtSecretKey);

    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; Path=/;`);

    res.status(200).json({ message: 'Login successful' }); 

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// GET /api/user (protected route)
app.get('/api/user', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { password, ...userData } = user; // Exclude the password from the response
    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// POST /api/events (protected route)
app.post('/api/events', authMiddleware, async (req, res) => {
  try {
    // 1. Get the authenticated user's ID
    const organizerId = req.user.id;

    // 2. Extract event data from the request body
    const { name, date, location, description, limit, image } = req.body;

    // 3. Create the event in the database
    const event = await prisma.event.create({
      data: {
        name,
        date: new Date(date), // Convert date string to Date object
        location,
        description,
        limit,
        image,
        organizerId, // Associate the event with the organizer
      },
    });

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});


// GET /api/events (protected route)
app.get('/api/events', authMiddleware, async (req, res) => { 
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


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});