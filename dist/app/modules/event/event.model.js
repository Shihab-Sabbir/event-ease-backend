"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const EventSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Event name is required'],
        trim: true,
    },
    date: {
        type: Date,
        required: [true, 'Event date is required'],
        validate: {
            validator: (value) => value > new Date(),
            message: 'Event date must be in the future',
        },
    },
    location: {
        type: String,
        required: [true, 'Event location is required'],
        trim: true,
    },
    maxAttendees: {
        type: Number,
        required: [true, 'Maximum number of attendees is required'],
        min: [1, 'There must be at least 1 attendee allowed'],
    },
    createdBy: {
        type: String,
        required: [true, 'Creator information is required'],
        trim: true,
    },
    attendees: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});
const Event = mongoose_1.default.model('Event', EventSchema);
exports.default = Event;
