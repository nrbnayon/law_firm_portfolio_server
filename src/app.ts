import cors from 'cors';
import express, { Request, Response } from 'express';
import globalErrorHandler from './shared/middlewares/globalErrorHandler';
import notFoundRoute from './shared/middlewares/notFoundRoute';
import path from 'path';
import { profileHTML } from './views/welcome.html';
import router from './routes';
import { Morgan } from './shared/utils/morgen';

const app = express();

//morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

// CORS — check ENV first, fallback to localhost
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// JSON and text/plain content types //body parser
app.use(express.json({ limit: '1024mb' }));
app.use(express.text({ type: 'text/plain', limit: '1024mb' }));
app.use(express.urlencoded({ extended: true, limit: '1024mb' }));

//file retrieve
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

//router
app.use('/api/v1', router);

//live response - serve the profile page
app.get('/', (req: Request, res: Response) => {
  res.send(profileHTML);
});

// Health check endpoint
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy and running',
    version: process.env.VERSION || "1.0.0",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

//global error handle
app.use(globalErrorHandler);

//*handle not found route;
app.use(notFoundRoute);

export default app;