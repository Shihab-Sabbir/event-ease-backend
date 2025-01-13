import { Document } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  date: Date;
  location: string;
  maxAttendees: number;
  createdBy: string;
  attendees: string[];
}
