import express from 'express';
import { AuthController } from './controllers/auth.controller';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000; 

const main = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully!');

    const authController = new AuthController(prisma);

    app.use(express.json());

    app.post('/register', authController.register);
    app.post('/login', authController.login);
    app.get('/me', authController.getAuthenticatedUser); 

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await prisma.$disconnect(); 
  }
};

main().catch((error) => console.error('Unhandled error:', error));

export default app;
