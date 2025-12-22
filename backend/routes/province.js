import { Router } from 'express';
import provinceController from '../controllers/province.js';

const route = new Router();

// GET: List ward
route.get('/', provinceController.listProvince);

export default route;