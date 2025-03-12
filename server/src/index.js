import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

import { connectDB } from './lib/db.js';

dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,  
    methods: ["GET", "POST", "PUT", "DELETE"],  
}));

app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true })); 

const PORT = process.env.PORT || 5002;

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
    console.log('Server is running on PORT: '+ PORT);
    connectDB();
});
