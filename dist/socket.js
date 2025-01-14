"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitEventUpdate = exports.emitEventFull = exports.emitNewAttendee = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
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
exports.initSocket = initSocket;
// Emit new attendee registration event
const emitNewAttendee = (data) => {
    if (io) {
        io.emit('new-attendee', data);
    }
    else {
        console.error('Socket.io not initialized');
    }
};
exports.emitNewAttendee = emitNewAttendee;
const emitEventFull = (data) => {
    if (io) {
        io.emit('event-full', data);
    }
    else {
        console.error('Socket.io not initialized');
    }
};
exports.emitEventFull = emitEventFull;
// Emit event update notification with changed keys and values
const emitEventUpdate = (data) => {
    if (io) {
        const { eventId, eventName, updates } = data;
        let updateMessage = `Event "${eventName}" has been updated.`;
        Object.keys(updates).forEach(key => {
            const { old, new: newValue } = updates[key];
            updateMessage += ` ${key} changed from "${old}" to "${newValue}".`;
        });
        console.log({ updateMessage });
        io.emit('event-update', { eventId, message: updateMessage });
    }
    else {
        console.error('Socket.io not initialized');
    }
};
exports.emitEventUpdate = emitEventUpdate;
