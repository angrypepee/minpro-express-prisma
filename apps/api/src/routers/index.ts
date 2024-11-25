import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { authMiddleware } from '@/middleware/authMiddleware';

const router = Router();
const authController = new AuthController();

// Authentication routes
router.post('/auth/register', (req, res) => authController.register(req, res));
router.post('/auth/login', (req, res) => authController.login(req, res));
router.get('/auth/me', authMiddleware, (req, res) => authController.getAuthenticatedUser(req, res));

export default router;
