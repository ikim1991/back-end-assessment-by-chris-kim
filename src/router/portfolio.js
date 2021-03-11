import express from 'express';
import { getPortfolio } from '../controller/portfolio.js';
import authenticate from '../middleware/auth.js';

const router = express.Router()

router.get('/portfolio', authenticate, getPortfolio)

export default router;