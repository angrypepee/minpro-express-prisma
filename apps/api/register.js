import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as yup from 'yup';

const prisma = new PrismaClient();

// Yup schema for validation
const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
}).required();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // 1. Parse the request body as JSON
      const parsedBody = JSON.parse(req.body);

      // 2. Validate the data
      try {
        await schema.validate(parsedBody);
      } catch (validationError) {
        return res.status(400).json({ error: validationError.errors });
      }

      // 3. Extract data from the parsed body
      const { name, email, password } = parsedBody;

      // 4. Check if the email is already registered
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
      }

      // 5. Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 6. Create the user in the database
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
      console.error(error); // Log the detailed error for debugging
      res.status(500).json({ error: 'Failed to create user' });
    }

  } else {
    res.status(405).end(); // Method Not Allowed for other methods
  }
}