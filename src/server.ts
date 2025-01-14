import mongoose from 'mongoose';
import { PORT, DB_URL } from './config';
import { logger, errorLogger } from './shared/logger';
import { Server } from 'http';
import { serverExitHandler } from './errors/serverExitHandler';
import { initSocket } from './socket';
import app from './app';

process.on('uncaughtException', err => {
  logger.error(err);
  process.exit(1);
});

let server: Server;

async function connectDb() {
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

connectDb();

process.on('SIGTERM', () => {
  if (server) {
    logger.info('SIGTERM is received');
    server.close();
  }
});
