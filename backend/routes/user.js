import { Router } from 'express';
import userController from '../controllers/user.js';
import requiredAdmin from '../middlewares/requiredAdmin.js';
import requiredToken from '../middlewares/requiredToken.js';

const route = new Router();

// GET: List user
route.get('/', requiredAdmin, userController.listUser);

// GET: Fetch an user
route.get('/:id', requiredToken, userController.getUser);

export default route;