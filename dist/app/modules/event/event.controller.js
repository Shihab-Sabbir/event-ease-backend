"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const event_service_1 = require("./event.service");
const user_model_1 = __importDefault(require("../user/user.model"));
const createEvent = async (req, res, next) => {
    try {
        const eventData = Object.assign(Object.assign({}, req.body), { creatorId: req.user.userId });
        const event = await event_service_1.EventService.createEventDB(eventData);
        res.status(201).json({
            success: true,
            message: 'Event created successfully!',
            data: event,
        });
    }
    catch (error) {
        next(error);
    }
};
const getAllEvents = async (req, res, next) => {
    try {
        const { creatorId } = req.query;
        const events = await event_service_1.EventService.getAllEventsDB(creatorId);
        res.status(200).json({
            success: true,
            message: 'Events retrieved successfully!',
            data: events,
        });
    }
    catch (error) {
        next(error);
    }
};
const getEventById = async (req, res, next) => {
    try {
        const eventId = req.params.id;
        const event = await event_service_1.EventService.getEventByIdDB(eventId);
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
    }
    catch (error) {
        next(error);
    }
};
const updateEvent = async (req, res, next) => {
    try {
        const eventId = req.params.id;
        const updatedEvent = await event_service_1.EventService.updateEventDB(eventId, req.body);
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
    }
    catch (error) {
        next(error);
    }
};
const deleteEvent = async (req, res, next) => {
    try {
        const eventId = req.params.id;
        const deletedEvent = await event_service_1.EventService.deleteEventDB(eventId);
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
    }
    catch (error) {
        next(error);
    }
};
const registerForEvent = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const user = (await user_model_1.default.findById(userId));
        const eventId = req.params.id;
        const result = await event_service_1.EventService.registerUserForEvent(eventId, user.email);
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
    }
    catch (error) {
        next(error);
    }
};
exports.EventController = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    registerForEvent,
};
