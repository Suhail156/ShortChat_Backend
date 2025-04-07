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

// MongoDB connection
mongoose.connect(process.env.DB)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://short-chat-frontend-og9y.vercel.app',
];

// CORS config
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Allow preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());

// Routes
app.use('/user', userRoutes);
app.use('/messages', messageRouter);

// Test route
app.get('/', (req, res) => {
  res.send('Server is up and running 🚀');
});

// HTTP server and Socket.IO setup
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('send_message', (data) => {
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
