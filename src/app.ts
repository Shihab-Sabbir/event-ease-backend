import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { requestLogger } from './shared/logger';
import routes from './router';
import { handleNoRouteFound } from './errors/handleNoRouteFound';
import { initSocket } from './socket';

const app: Application = express();

app.use(cors());

//parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//track api request log
app.use(requestLogger);

app.get('/', (req: Request, res: Response) => {
  res.send('Event Ease Auth Server Running !');
});

//routes
app.use('/api/v1', routes);

// Test route
app.get('/test', async (req: Request, res: Response, next: NextFunction) => {
  return res.send('Test is okay!');
});

// Global error handler
app.use(globalErrorHandler);

//handle no route found error
app.use(handleNoRouteFound);

export default app;
