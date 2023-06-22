// Import @ Alias for ./src

require('module-alias/register');
require('express-async-errors');

import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Import Routes
import AuthRoutes from '@/routes/api/auth/auth.routes';
import HomeRoutes from '@/routes/home/home.routes';
import ChatRoutes from '@/routes/api/chat/chat.routes'

// Import Middlewares
import { errorHandler } from '@/middlewares/errors/error-handler';
import { specificErrorHandler } from '@/middlewares/errors/specific-handler';

// Config
dotenv.config();
const port = process.env.PORT || 3002;
const app: Express = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_SERVER, credentials: true }));

// Routes /api
app.use('/api/auth', AuthRoutes);
app.use('/api/chat', ChatRoutes)

// Routes /home

app.use('/home', HomeRoutes);

// Errors Middlewares
app.use(specificErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
