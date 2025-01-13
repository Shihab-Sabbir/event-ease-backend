import { Server } from 'socket.io';

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', socket => {
    console.log('A user connected');
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

// Emit new attendee registration event
export const emitNewAttendee = (data: { eventName: string; userId: string }) => {
  if (io) {
    io.emit('new-attendee', data);
  } else {
    console.error('Socket.io not initialized');
  }
};

export const emitEventFull = (data: { eventId: string; message: string }) => {
  if (io) {
    io.emit('event-full', data);
  } else {
    console.error('Socket.io not initialized');
  }
};

// Emit event update notification with changed keys and values
export const emitEventUpdate = (data: {
  eventId: string;
  eventName: string;
  updates: { [key: string]: { old: any; new: any } };
}) => {
  if (io) {
    const { eventId, eventName, updates } = data;
    let updateMessage = `Event "${eventName}" has been updated.`;

    Object.keys(updates).forEach(key => {
      const { old, new: newValue } = updates[key];
      updateMessage += ` ${key} changed from "${old}" to "${newValue}".`;
    });
    console.log({ updateMessage });
    io.emit('event-update', { eventId, message: updateMessage });
  } else {
    console.error('Socket.io not initialized');
  }
};
