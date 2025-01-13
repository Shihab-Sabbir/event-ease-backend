import express from 'express';
import { EventController } from './event.controller';
import auth from '../../middlewares/auth';

const eventRoutes = express.Router();

// Public routes
eventRoutes.get('/', EventController.getAllEvents);
eventRoutes.get('/:id', EventController.getEventById);

// Protected routes
eventRoutes.post('/', auth, EventController.createEvent);
eventRoutes.post('/register/:id', auth, EventController.registerForEvent);
eventRoutes.put('/:id', auth, EventController.updateEvent);
eventRoutes.delete('/:id', auth, EventController.deleteEvent);

export default eventRoutes;
