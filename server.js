import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './Routes/userRoutes.js';
import messageRouter from './Routes/messageRoute.js';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

dotenv.config();

const app = express();

// Allow both local and deployed frontend
const allowedOrigins = ['http://localhost:5173', 'https://short-chat-frontend-og9y.vercel.app'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('send_message', (data) => {
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

mongoose.connect(process.env.DB)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log(error));

app.use('/user', userRoutes);
app.use('/messages', messageRouter);

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
