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
      const { name, email, password, role, referralCode } = parsedBody;

      // 4. Check if the email is already registered
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
      }

      // 5. Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Generate a unique referral code for the new user
      let generatedReferralCode;
      do {
        generatedReferralCode = generateReferralCode();
      } while (await prisma.user.findUnique({ where: { referralCode: generatedReferralCode } }));

      // 6. Create the user in the database
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role,
          referralCode: generatedReferralCode,
          referredBy: referralCode ? await prisma.user.findUnique({ 
            where: { referralCode },
            select: { id: true }
          }).then(user => user?.id) : null,
        },
      });

      res.status(201).json({ message: 'User created successfully', user });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create user' });
    }

  } else if (req.method === 'PUT') {
    try {
      const { userId, referralCode } = req.body;

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const referrer = await prisma.user.findUnique({ where: { referralCode } });
      if (!referrer || referrer.id === user.id) {
        return res.status(400).json({ error: 'Invalid referral code' });
      }

      if (user.referredBy) {
        return res.status(400).json({ error: 'You have already redeemed a referral code' });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { referredBy: referrer.id }
      });

      res.status(200).json({ message: 'Referral code redeemed successfully' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to redeem referral code' });
    }
  } else {
    res.status(405).end();
  }
}