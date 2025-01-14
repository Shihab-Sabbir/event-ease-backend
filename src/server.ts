import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { Server } from 'http';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { requestLogger, logger, errorLogger } from './shared/logger';
import routes from './router';
import { handleNoRouteFound } from './errors/handleNoRouteFound';
import { serverExitHandler } from './errors/serverExitHandler';
import { initSocket } from './socket';
import { PORT, DB_URL } from './config';

const app: Application = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.send('Event Ease Auth Server Running !');
});

// API routes
app.use('/api/v1', routes);

// Test route
app.get('/test', async (req: Request, res: Response, next: NextFunction) => {
  return res.send('Test is okay!');
});

// Global error handler
app.use(globalErrorHandler);

// Handle no route found error
app.use(handleNoRouteFound);

let server: Server;

process.on('uncaughtException', err => {
  logger.error(err);
  process.exit(1);
});

async function connectDbAndStartServer() {
  try {
    await mongoose.connect(`${DB_URL}`);
    logger.info('Database connection established !');

    server = app.listen(PORT, () => {
      logger.info(`App is listening on port ${PORT}`);
    });

    initSocket(server);
  } catch (error) {
    errorLogger.error('Failed to connect database', error);
  }

  process.on('unhandledRejection', err => {
    serverExitHandler(server, err);
  });
}

connectDbAndStartServer();

process.on('SIGTERM', () => {
  if (server) {
    logger.info('SIGTERM is received');
    server.close();
  }
});
