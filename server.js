import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import userRoutes from './Routes/userRoutes.js';
import messageRouter from './Routes/messageRoute.js';

dotenv.config();

const app = express();

// Define allowed origins
const allowedOrigins = ['http://localhost:5173', 'https://short-chat-frontend-og9y.vercel.app'];

// CORS configuration for Express
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Test route to confirm server is running
app.get('/', (req, res) => {
  res.send('Server is running and CORS is configured ✅');
});

// Create HTTP server and Socket.IO server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('send_message', (data) => {
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// MongoDB connection
mongoose.connect(process.env.DB)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('MongoDB connection error:', error));

// Routes
app.use('/user', userRoutes);
app.use('/messages', messageRouter);

// Start server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
