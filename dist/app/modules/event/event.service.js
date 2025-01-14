"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const event_model_1 = __importDefault(require("./event.model"));
const socket_1 = require("../../../socket"); // Adjust the import path as necessary
const createEventDB = async (eventData) => {
    const existingEvent = await event_model_1.default.findOne({ name: eventData.name });
    if (existingEvent) {
        throw new Error('An event with this name already exists!');
    }
    const event = new event_model_1.default(eventData);
    await event.save();
    return event;
};
const getAllEventsDB = async (creatorId) => {
    const filter = {};
    if (creatorId) {
        filter.createdBy = creatorId;
    }
    return event_model_1.default.find(filter);
};
const getEventByIdDB = async (id) => {
    return event_model_1.default.findById(id);
};
const updateEventDB = async (id, eventData) => {
    // Check if eventData contains a name and if the name is being updated
    if (eventData.name) {
        const existingEvent = await event_model_1.default.findOne({
            name: eventData.name,
            _id: { $ne: id },
        });
        if (existingEvent) {
            throw new Error('An event with this name already exists!');
        }
    }
    const event = await event_model_1.default.findByIdAndUpdate(id, eventData, { new: true });
    if (event) {
        const updates = {};
        Object.keys(eventData).forEach(key => {
            const eventKey = key;
            if (event[eventKey] !== eventData[eventKey]) {
                updates[key] = {
                    old: event[eventKey],
                    new: eventData[eventKey],
                };
            }
        });
        (0, socket_1.emitEventUpdate)({
            eventId: id,
            eventName: event.name,
            updates,
        });
    }
    return event;
};
const deleteEventDB = async (id) => {
    return event_model_1.default.findByIdAndDelete(id);
};
const registerUserForEvent = async (eventId, email) => {
    try {
        const event = await event_model_1.default.findById(eventId);
        if (!event) {
            return {
                error: true,
                status: 404,
                message: 'Event not found!',
            };
        }
        if (event.attendees.length >= event.maxAttendees) {
            (0, socket_1.emitEventFull)({
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
        (0, socket_1.emitNewAttendee)({ eventName: event.name, userId: email });
        // Emit full event notification if max capacity is reached
        if (event.attendees.length >= event.maxAttendees) {
            (0, socket_1.emitEventFull)({
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
    }
    catch (error) {
        return {
            error: true,
            status: 500,
            message: 'Error registering user for event: ' + error.message,
        };
    }
};
exports.EventService = {
    createEventDB,
    getAllEventsDB,
    getEventByIdDB,
    updateEventDB,
    deleteEventDB,
    registerUserForEvent,
};
