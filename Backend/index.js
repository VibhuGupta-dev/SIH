import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongoConnect.js';
import authRoutes from './routes/Authroutes.js';
import userinterestRoutes from './routes/MentalAssesmentroutes.js';
import { Server } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import Report from './models/Report.js';
import motivationalRoutes from './routes/Motivationalroutes.js';
import communityRoutes from './routes/ComunityRoute.js';

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5174', 'http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5174', 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/usermentalhealth', userinterestRoutes);
app.use('/api/motivational-program', motivationalRoutes);
app.use('/api/community', communityRoutes);
// Socket.IO Logic for Anonymous Chat
let waitingUsers = [];

const broadcastQueueCount = () => {
  console.log('Broadcasting queue count:', waitingUsers.length);
  io.emit('queueUpdate', { count: waitingUsers.length });
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Broadcast initial queue count
  broadcastQueueCount();

  // Authenticate Socket Connection
  socket.on('authenticate', (token) => {
    if (!token) {
      console.log('Authentication failed: No token provided for socket', socket.id);
      socket.emit('authenticated', { success: false, error: 'No token provided' });
      socket.disconnect();
      return;
    }
    try {
      console.log('Verifying token:', token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      const userId = decoded.userId || decoded.id; // Support both userId and id for compatibility
      if (!userId) {
        console.log('Authentication failed: No userId or id in token for socket', socket.id);
        socket.emit('authenticated', { success: false, error: 'Invalid token payload: missing userId or id' });
        socket.disconnect();
        return;
      }
      socket.userId = userId;
      console.log('Authentication successful for user:', socket.userId, 'socket:', socket.id);
      socket.emit('authenticated', { success: true });
    } catch (err) {
      console.log('Authentication failed:', err.message, 'for socket', socket.id);
      socket.emit('authenticated', { success: false, error: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token' });
      socket.disconnect();
    }
  });

  // Find Stranger
  socket.on('findStranger', () => {
    if (!socket.userId) {
      console.log('Find stranger failed: Not authenticated for socket', socket.id);
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }
    console.log('Find stranger requested for socket:', socket.id, 'user:', socket.userId);
    console.log('Current waiting users:', waitingUsers.map(u => ({ userId: u.userId, socketId: u.socket.id })));

    // Check if user is already in queue
    if (waitingUsers.some(user => user.socket.id === socket.id)) {
      console.log('User already in queue:', socket.userId);
      socket.emit('waiting', { message: 'Already waiting for a stranger...' });
      return;
    }

    // Try to pair with another user
    const partner = waitingUsers.find(user => user.socket.id !== socket.id && user.socket.connected);
    if (partner) {
      waitingUsers = waitingUsers.filter(user => user.socket.id !== partner.socket.id);
      const roomId = `room_${Math.random().toString(36).substr(2, 9)}`;
      socket.join(roomId);
      partner.socket.join(roomId);
      console.log('Paired users:', socket.userId, 'and', partner.userId, 'in room:', roomId);
      io.to(roomId).emit('chatStarted', { roomId });
      socket.roomId = roomId;
      partner.socket.roomId = roomId;
      socket.partnerId = partner.userId;
      partner.socket.partnerId = socket.userId;
      broadcastQueueCount();
    } else {
      waitingUsers.push({ userId: socket.userId, socket });
      console.log('Added to waiting queue:', socket.userId, 'socket:', socket.id);
      socket.emit('waiting', { message: 'Waiting for a stranger...' });
      broadcastQueueCount();
    }
  });

  // Send Message
  socket.on('message', ({ roomId, text }) => {
    if (socket.roomId === roomId) {
      console.log('Message sent in room:', roomId, 'text:', text, 'from:', socket.userId);
      io.to(roomId).emit('message', { sender: 'Stranger', text });
    } else {
      console.log('Invalid room ID for message from socket:', socket.id, 'expected:', socket.roomId, 'got:', roomId);
      socket.emit('error', { message: 'Invalid room' });
    }
  });

  // Next Chat
  socket.on('nextChat', () => {
    if (socket.roomId) {
      console.log('Next chat requested, leaving room:', socket.roomId, 'for socket:', socket.id);
      io.to(socket.roomId).emit('strangerDisconnected', { message: 'Stranger has left the chat.' });
      socket.leave(socket.roomId);
      socket.roomId = null;
      socket.partnerId = null;
      socket.emit('findStranger');
    }
  });

  // Report User
  socket.on('report', async ({ reason }) => {
    if (socket.partnerId) {
      try {
        const report = new Report({
          reporterId: socket.userId,
          reportedUserId: socket.partnerId,
          reason,
        });
        await report.save();
        console.log('Report submitted by:', socket.userId, 'against:', socket.partnerId);
        socket.emit('reportSubmitted', { message: 'Report submitted' });
      } catch (err) {
        console.error('Report save error:', err);
        socket.emit('error', { message: 'Failed to submit report' });
      }
    } else {
      console.log('Report failed: No partner ID for socket:', socket.id);
      socket.emit('error', { message: 'No partner to report' });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    waitingUsers = waitingUsers.filter(user => user.socket.id !== socket.id);
    if (socket.roomId) {
      console.log('User disconnected from room:', socket.roomId);
      io.to(socket.roomId).emit('strangerDisconnected', { message: 'Stranger has left the chat.' });
      socket.leave(socket.roomId);
    }
    broadcastQueueCount();
  });
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: '✅ Auth Server with Anonymous Chat is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: 'Validation Error', errors });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, message: `${field} already exists` });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message,
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
  });
});

// Start server
server.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server with Anonymous Chat is running on http://localhost:${process.env.PORT || 3000}`);
  console.log(`📧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 CORS enabled for frontend`);
  console.log(`💬 Socket.IO enabled for real-time chat`);
});
