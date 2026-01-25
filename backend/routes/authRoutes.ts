import express, { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { verifyToken } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/getMe', verifyToken, getMe);


export default router;