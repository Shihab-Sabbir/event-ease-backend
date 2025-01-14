Here is a detailed `README.md` for your GitHub repository:

---

# EventEase Platform - Backend

## Overview

EventEase is a platform for managing events and attendees, featuring user authentication, event management, and real-time updates using **Socket.IO**. This repository contains the **backend** of the application, built using **Express.js**, handling APIs for user registration, event management, and attendee registration. It also supports real-time notifications for event updates.

## Features

- **User Authentication**:
  - User registration and login using email and password.
  - JWT-based authentication for securing routes.
  
- **Event Management**:
  - Create, update, and delete events.
  - Events contain: `name`, `date`, `location`, `maxAttendees`, `createdBy`.
  
- **Attendee Registration**:
  - Users can register for events, with a cap on `maxAttendees` per event.

- **Real-Time Notifications**:
  - Event registration notifications.
  - Notifications when an event reaches its maximum capacity or when event details are updated.

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/eventease-backend.git
   cd eventease-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   JWT_SECRET=<your-secret-key>
   DATABASE_URL=<your-database-url>
   ```

4. To run the development server:

   ```bash
   npm run start
   ```

   This will start the server with live reload.

5. For production, first build the application:

   ```bash
   npm run build
   ```

   Then, run the built application:

   ```bash
   npm start
   ```

## API Routes

### Authentication

1. **POST `/auth/create-user`**  
   - Description: Register a new user.
   - Request Body:
     ```json
     {
       "email": "user@example.com",
       "password": "password123"
     }
     ```
   - Response: `200 OK` or `400 Bad Request` (if validation fails).

2. **POST `/auth/login`**  
   - Description: Login a user and get a JWT token.
   - Request Body:
     ```json
     {
       "email": "user@example.com",
       "password": "password123"
     }
     ```
   - Response: `200 OK` with a JWT token or `401 Unauthorized` (if credentials are invalid).

### Event Management

1. **GET `/event/`**  
   - Description: Get a list of all events.
   - Response:
     ```json
     [
       {
         "id": "1",
         "name": "Event 1",
         "date": "2025-01-10",
         "location": "Location 1",
         "maxAttendees": 50,
         "createdBy": "user@example.com"
       }
     ]
     ```

2. **GET `/event/:id`**  
   - Description: Get a specific event by ID.
   - Response:
     ```json
     {
       "id": "1",
       "name": "Event 1",
       "date": "2025-01-10",
       "location": "Location 1",
       "maxAttendees": 50,
       "createdBy": "user@example.com"
     }
     ```

3. **POST `/event/`**  
   - Description: Create a new event.
   - Request Body:
     ```json
     {
       "name": "Event 2",
       "date": "2025-02-10",
       "location": "Location 2",
       "maxAttendees": 100
     }
     ```
   - Response: `201 Created` or `400 Bad Request` (if validation fails).

4. **POST `/event/register/:id`**  
   - Description: Register for an event.
   - Response: `200 OK` or `400 Bad Request` (if the event is full).

5. **PUT `/event/:id`**  
   - Description: Update an event.
   - Request Body:
     ```json
     {
       "name": "Updated Event",
       "date": "2025-02-15",
       "location": "Updated Location",
       "maxAttendees": 120
     }
     ```
   - Response: `200 OK` or `404 Not Found` (if event does not exist).

6. **DELETE `/event/:id`**  
   - Description: Delete an event.
   - Response: `200 OK` or `404 Not Found` (if event does not exist).

---

## Real-Time Notifications with Socket.IO

The backend uses **Socket.IO** to send real-time updates to clients when:

- A new attendee registers for an event.
- An event is updated or reaches its maximum capacity.

Example notification broadcast:

```js
const io = require('socket.io')(server);

// When a new attendee registers
io.emit('attendee-registered', { eventId: '1', newAttendeeCount: 50 });

// When an event reaches max capacity
io.emit('event-full', { eventId: '1', message: 'Event is full' });
```

---

## Middleware

### `auth.ts`
- **Purpose**: Protects routes by ensuring the user is authenticated.
- **Implementation**: Checks the presence of a valid JWT token in the request header and attaches the user information to the request object.

### `validateRequest.ts`
- **Purpose**: Validates incoming request data based on the defined Zod schema.
- **Usage**: Ensures that the data in the request body is in the correct format before reaching the controller.

---


## Contributing

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Open a pull request with a clear description of your changes.

---

## License

MIT License. See [LICENSE](./LICENSE) for more details.

---

## Acknowledgments

- **Express.js** for building the API.
- **Socket.IO** for real-time communication.
- **JWT** for secure user authentication.

---

This README provides the necessary steps for setting up and using the backend for the EventEase platform. Be sure to follow the instructions closely to ensure smooth setup and development.