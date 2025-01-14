import { Request, Response, NextFunction } from 'express';
import { EventService } from './event.service';
import User from '../user/user.model';
import { IUser } from '../user/user.interface';

const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventData = { ...req.body, creatorId: req.user.userId };
    const event = await EventService.createEventDB(eventData);
    res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { creatorId } = req.query;
    const events = await EventService.getAllEventsDB(creatorId as string);
    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully!',
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventId = req.params.id;
    const event = await EventService.getEventByIdDB(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found!',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Event retrieved successfully!',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = req.params.id;
    const updatedEvent = await EventService.updateEventDB(eventId, req.body);
    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found!',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Event updated successfully!',
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = req.params.id;
    const deletedEvent = await EventService.deleteEventDB(eventId);
    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found!',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

const registerForEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user;
    const user: IUser = (await User.findById(userId)) as IUser;
    const eventId = req.params.id;
    const result = await EventService.registerUserForEvent(eventId, user.email);

    if (result.error) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully registered for the event!',
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export const EventController = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
};
