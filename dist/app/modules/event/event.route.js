"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_controller_1 = require("./event.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const eventRoutes = express_1.default.Router();
// Public routes
eventRoutes.get('/', event_controller_1.EventController.getAllEvents);
eventRoutes.get('/:id', event_controller_1.EventController.getEventById);
// Protected routes
eventRoutes.post('/', auth_1.default, event_controller_1.EventController.createEvent);
eventRoutes.post('/register/:id', auth_1.default, event_controller_1.EventController.registerForEvent);
eventRoutes.put('/:id', auth_1.default, event_controller_1.EventController.updateEvent);
eventRoutes.delete('/:id', auth_1.default, event_controller_1.EventController.deleteEvent);
exports.default = eventRoutes;
