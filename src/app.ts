import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { Server } from 'http';
import { errorLogger, logger, requestLogger } from './shared/logger';
import router from './router';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { handleNoRouteFound } from './errors/handleNoRouteFound';
import { DB_URL, PORT } from './config';
import { initSocket } from './socket';
import { serverExitHandler } from './errors/serverExitHandler';

// Initialize Express App
const app: Application = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Event Ease Auth Server Running !');
});

app.use('/api/v1', router);

app.get('/test', async (req: Request, res: Response, next: NextFunction) => {
  return res.send('Test is okay!');
});

// Error Handling
app.use(globalErrorHandler);
app.use(handleNoRouteFound);

// Server and Database Connection
let server: Server;

process.on('uncaughtException', err => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

async function connectDbAndStartServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(`${DB_URL}`);
    logger.info('Database connection established!');

    // Start Server
    server = app.listen(PORT, () => {
      logger.info(`App is listening on port ${PORT}`);
    });

    // Initialize WebSocket
    initSocket(server);
  } catch (error) {
    errorLogger.error('Failed to connect database', error);
  }

  // Handle Unhandled Promise Rejections
  process.on('unhandledRejection', err => {
    serverExitHandler(server, err);
  });
}

connectDbAndStartServer();

// Graceful Shutdown
process.on('SIGTERM', () => {
  if (server) {
    logger.info('SIGTERM received. Closing server...');
    server.close(() => {
      logger.info('Server closed gracefully.');
    });
  }
});

export default app;
