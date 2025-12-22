import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import authRoute from './routes/auth.js';
import orderRoute from './routes/order.js';
import wardRoute from './routes/ward.js';
import provinceRoute from './routes/province.js';
import userRoute from './routes/user.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';
import auth from './middlewares/auth.js';
import restResponse from './middlewares/restResponse.js';
import requiredActive from './middlewares/requiredActive.js';

const app = express();

// CORS, open for all domain
app.use(cors());

// Log
app.use(morgan('dev'));

// Parse JSON body
app.use(bodyParser.json());

// Rest response
app.use(restResponse);

// Parse token
app.use(auth);

// Auth
app.use('/auth', authRoute);

app.use(requiredActive);

// Order
app.use('/orders', orderRoute);
// Ward
app.use('/wards', wardRoute);
// Provice
app.use('/provinces', provinceRoute);
// User
app.use('/users', userRoute);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;