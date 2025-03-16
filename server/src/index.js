import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

import { connectDB } from './lib/db.js';

import {app, server} from './lib/socket.js';
dotenv.config();
connectDB();
const PORT = process.env.PORT || 5002;

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());


server.listen(PORT, () => {
    console.log('Server is running on PORT: '+ PORT);
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
