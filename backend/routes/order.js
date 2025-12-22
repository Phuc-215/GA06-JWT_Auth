import { Router } from 'express';
import orderController from '../controllers/order.js';
import orderSchema from '../schemas/order.js';
import validationMiddleware from '../middlewares/validation.js';

const route = new Router();

// GET: List order
route.get('/', orderController.listOrder);

// GET: Fetch an order
route.get('/:id', orderController.getOrder);

// POST: Create order
route.post('/', validationMiddleware(orderSchema), orderController.createOrder);

// PUT: Update order
route.put('/:id', validationMiddleware(orderSchema), orderController.updateOrder);

// DELETE: Remove order
route.delete('/:id', orderController.removeOrder);

export default route;