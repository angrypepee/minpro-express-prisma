// apps/api/src/routers/auth.router.ts 

import express from 'express';
import { login, register } from 'src/controllers/auth.controller';

const router = express.Router();

router.post('/register', register);
router.post('/login', login); 

export default router;
