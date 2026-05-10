import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import job from './src/config/cron.js';
import http from 'http';
import { Server } from 'socket.io';

import { connectDB } from './src/config/db.js'
import authRoutes from './src/routes/authRoutes.js'
import postRoutes from './src/routes/postRoutes.js'
import requestRoutes from './src/routes/requestRoutes.js'
import messageRoutes from './src/routes/messageRoutes.js'


dotenv.config()


const app = express()
const PORT = process.env.PORT || 8000
job.start()

app.use(cors())
app.use(express.json())


app.use('/api/users', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/requests', requestRoutes)
app.use('/api/messages', messageRoutes)

app.get("/", (req, res) => {
    res.json({ message: "Badallink API is live! 🚀", status: "Healthy" });
});

// Create HTTP server
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: '*' }
})

app.set('socketio', io);


io.on('connection', (socket) => {
    try {
        console.log('A user connected:', socket.id);

        // 1. THE LISTENER: Waiting for the phone to say "I want to join a chat"
        socket.on('join-chat', ({ requestId }) => {
            console.log(`User ${socket.id} joined booth: ${requestId}`);

            // 2. THE BOOTH: This puts the user's socket into a private room
            socket.join(requestId);

            // 3. THE MEGAPHONE: We test it by shouting to everyone in THIS chatId room
            io.to(requestId).emit('receive_message', {
                text: `System: User joined the booth.`,
                sender: { username: 'System' },
                createdAt: new Date()
            });
        });

        // 4. THE EXIT: Host logs when a customer leaves the restaurant
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });

    } catch (error) {
        console.error('Socket error:', error);
    }
});



server.listen(PORT, () => {
    console.log(`The app is running on port ${PORT}`,
        connectDB()
    )
})