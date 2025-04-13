const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // For development. In production, set this to your frontend URL
        methods: ["GET", "POST"]
    }
});

// Rooms data structure to keep track of users
const rooms = {};

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join room event
    socket.on('join-room', (data) => {
        // Make sure data has the correct format with roomId as a string
        const roomId = typeof data.roomId === 'string' ? data.roomId : String(data.roomId);
        const userId = data.userId;

        console.log(`User ${userId} joining room ${roomId}`);

        // Create room if it doesn't exist
        if (!rooms[roomId]) {
            rooms[roomId] = new Set();
        }

        // Check if room is full (max 2 users for 1-on-1 call)
        if (rooms[roomId].size >= 2) {
            socket.emit('room-full');
            return;
        }

        // Join socket.io room
        socket.join(roomId);

        // Add user to our room tracking
        rooms[roomId].add(socket.id);

        // Store roomId in socket object for easy access
        socket.roomId = roomId;
        socket.userId = userId;

        console.log(`🧑‍🤝‍🧑 Users in room ${roomId}:`, Array.from(rooms[roomId]));

        // Notify other users in the room
        socket.to(roomId).emit('user-joined', userId);
    });

    // WebRTC signaling events
    socket.on('offer', ({ offer, roomId }) => {
        console.log(`Relaying offer in room ${roomId}`);
        socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', ({ answer, roomId }) => {
        console.log(`Relaying answer in room ${roomId}`);
        socket.to(roomId).emit('answer', answer);
    });

    socket.on('ice-candidate', ({ candidate, roomId }) => {
        console.log(`Relaying ICE candidate in room ${roomId}`);
        socket.to(roomId).emit('ice-candidate', candidate);
    });

    // Handle user leaving
    socket.on('leave-room', ({ roomId }) => {
        handleUserLeaving(socket, roomId);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);

        // Find and clean up rooms this user was in
        if (socket.roomId) {
            handleUserLeaving(socket, socket.roomId);
        }
    });
});

function handleUserLeaving(socket, roomId) {
    // Notify other users in the room
    socket.to(roomId).emit('user-left');

    // Remove user from room tracking
    if (rooms[roomId]) {
        rooms[roomId].delete(socket.id);

        // Clean up empty rooms
        if (rooms[roomId].size === 0) {
            delete rooms[roomId];
        }
    }

    // Leave socket.io room
    socket.leave(roomId);
}

// Basic health check route
app.get('/health', (req, res) => {
    res.status(200).send('Server is running');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Signaling server running on port ${PORT}`);
});
