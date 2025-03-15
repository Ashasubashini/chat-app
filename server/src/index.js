import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

import { connectDB } from './lib/db.js';

import {app, server} from './lib/socket.js';

const PORT = process.env.PORT || 5002;

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            "https://chat-app-client-five-ruddy.vercel.app",
            "http://localhost:5173" // Allow localhost for development
        ];

        if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());


server.listen(PORT, () => {
    console.log('Server is running on PORT: '+ PORT);
    connectDB();
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
