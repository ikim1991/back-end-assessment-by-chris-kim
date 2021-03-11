import express from 'express';
import { home, userRegister, userLogin, userLogout } from '../controller/user.js';

const router = express.Router()

router.get('/', home)
router.post('/register', userRegister)
router.post('/login', userLogin)
router.post('/logout', userLogout)

export default router;