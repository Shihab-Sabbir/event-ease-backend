import Event from './event.model';
import {
  emitNewAttendee,
  emitEventFull,
  emitEventUpdate,
} from '../../../socket'; // Adjust the import path as necessary
import { IEvent } from './event.interface';

const createEventDB = async (eventData: IEvent): Promise<IEvent> => {
  const existingEvent = await Event.findOne({ name: eventData.name });

  if (existingEvent) {
    throw new Error('An event with this name already exists!');
  }
  const event = new Event(eventData);
  await event.save();
  return event;
};

const getAllEventsDB = async (creatorId?: string): Promise<IEvent[]> => {
  const filter: Record<string, any> = {};
  if (creatorId) {
    filter.createdBy = creatorId;
  }
  return Event.find(filter);
};

const getEventByIdDB = async (id: string): Promise<IEvent | null> => {
  return Event.findById(id);
};

const updateEventDB = async (
  id: string,
  eventData: Partial<IEvent>
): Promise<IEvent | null> => {
  // Check if eventData contains a name and if the name is being updated
  if (eventData.name) {
    const existingEvent = await Event.findOne({
      name: eventData.name,
      _id: { $ne: id },
    });

    if (existingEvent) {
      throw new Error('An event with this name already exists!');
    }
  }

  const event = await Event.findByIdAndUpdate(id, eventData, { new: true });
  if (event) {
    const updates: Record<string, { old: any; new: any }> = {};

    Object.keys(eventData).forEach(key => {
      const eventKey = key as keyof IEvent;
      if (event[eventKey] !== eventData[eventKey]) {
        updates[key] = {
          old: event[eventKey],
          new: eventData[eventKey],
        };
      }
    });

    emitEventUpdate({
      eventId: id,
      eventName: event.name,
      updates,
    });
  }

  return event;
};

const deleteEventDB = async (id: string): Promise<IEvent | null> => {
  return Event.findByIdAndDelete(id);
};

const registerUserForEvent = async (eventId: string, email: string) => {
  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return {
        error: true,
        status: 404,
        message: 'Event not found!',
      };
    }

    if (event.attendees.length >= event.maxAttendees) {
      emitEventFull({
        eventId,
        message: 'Event has reached maximum capacity!',
      });
      return {
        error: true,
        status: 400,
        message: 'Event is full!',
      };
    }

    if (event.attendees.includes(email)) {
      return {
        error: true,
        status: 400,
        message: 'You are already registered for this event!',
      };
    }

    event.attendees.push(email);
    await event.save();

    // Emit notification for new attendee registration
    emitNewAttendee({ eventName: event.name, userId: email });

    // Emit full event notification if max capacity is reached
    if (event.attendees.length >= event.maxAttendees) {
      emitEventFull({
        eventId,
        message: 'Event has reached maximum capacity!',
      });
    }

    return {
      error: false,
      status: 200,
      message: 'User registered successfully',
      data: event,
    };
  } catch (error: any) {
    return {
      error: true,
      status: 500,
      message: 'Error registering user for event: ' + error.message,
    };
  }
};

export const EventService = {
  createEventDB,
  getAllEventsDB,
  getEventByIdDB,
  updateEventDB,
  deleteEventDB,
  registerUserForEvent,
};
