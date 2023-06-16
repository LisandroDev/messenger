// Import @ Alias for ./src

require('module-alias/register')
require('express-async-errors');

import express, { Express } from 'express';
import dotenv from 'dotenv';

// Import Routes
import ApiRoutes from '@/routes/Api.routes'

// Import Middlewares
import { errorHandler } from '@/middlewares/errors/error-handler';
import { specificErrorHandler } from '@/middlewares/errors/specific-handler'

// Config 
dotenv.config();
const port = process.env.PORT || 3002;
const app: Express = express();
app.use(express.json());


// Routes
app.use('/api', ApiRoutes)

// Errors Middlewares
app.use(specificErrorHandler);
app.use(errorHandler);



app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
