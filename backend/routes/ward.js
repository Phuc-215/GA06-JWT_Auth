import { Router } from 'express';
import wardController from '../controllers/ward.js';

const route = new Router();

// GET: List ward
route.get('/', wardController.listWard);

export default route;