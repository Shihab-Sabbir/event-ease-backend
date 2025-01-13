import express from 'express';
import userRoutes from '../app/modules/user/user.route';
import auth from '../app/middlewares/auth';
import eventRoutes from '../app/modules/event/event.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: userRoutes,
  },
  {
    path: '/event',
    route: eventRoutes,
  },
];

defaultRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
