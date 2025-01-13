import mongoose, { Schema, Model } from 'mongoose';
import { IEvent } from './event.interface';

const EventSchema: Schema<IEvent> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
      validate: {
        validator: (value: Date) => value > new Date(),
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
  },
  {
    timestamps: true,
  }
);

const Event: Model<IEvent> = mongoose.model<IEvent>('Event', EventSchema);

export default Event;
