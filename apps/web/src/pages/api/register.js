// web/pages/api/register.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as yup from 'yup';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Yup schema for validation
const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  role: yup.string().oneOf(['ATTENDEE', 'ORGANIZER']).required('Role is required'),
}).required();

// Function to generate a random referral code
function generateReferralCode(length = 7) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
    .toUpperCase();
}

// API handler for registration
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // 1. Parse the request body as JSON
      const parsedBody = req.body;

      // 2. Validate the request data using Yup
      try {
        await schema.validate(parsedBody);
      } catch (validationError) {
        return res.status(400).json({ error: validationError.errors });
      }

      // 3. Extract the fields from the request body
      const { name, email, password, role, referralCode } = parsedBody;

      // 4. Check if the email is already registered in the database
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
      }

      // 5. Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 6. Generate a unique referral code for the new user
      let generatedReferralCode;
      do {
        generatedReferralCode = generateReferralCode();
      } while (await prisma.user.findUnique({ where: { referralCode: generatedReferralCode } }));

      // 7. If the user has referred someone, find the user with the referral code
      let referredById = null;
      if (referralCode) {
        const referrer = await prisma.user.findUnique({ where: { referralCode } });
        if (referrer) {
          referredById = referrer.id;
        }
      }

      // 8. Create the new user in the database
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          referralCode: generatedReferralCode,
          referredBy: referredById,
        },
      });

      // 9. Return a success response
      res.status(201).json({ message: 'User created successfully', user });

    } catch (error) {
      console.error('Error during user registration:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    // Method Not Allowed for non-POST requests
    res.status(405).json({ error: 'Method not allowed' });
  }
}
