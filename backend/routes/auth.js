import { Router } from 'express';
import authController from '../controllers/auth.js';
import requiredToken from '../middlewares/requiredToken.js';
import requiredActive from '../middlewares/requiredActive.js';

const route = new Router();

// POST: Register
route.post('/register', authController.register);

// POST: Login
route.post('/login', authController.login);

// GET: Get current user
route.get('/me', requiredActive, authController.getCurrentUser);

// POST: Activate user 
route.post('/activate', authController.activate);

export default route;