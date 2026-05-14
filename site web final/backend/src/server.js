import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config, validateConfig } from './config/env.js';
import { connectDB, disconnectDB } from './config/database.js';
import { initEmailService } from './services/emailService.js';
import { startReminderScheduler, stopReminderScheduler } from './services/reminderService.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import favoritesRoutes from './routes/favoritesRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database availability middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api') && mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database unavailable. Please try again later.',
    });
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/events', eventsRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
async function start() {
  try {
    validateConfig();
    
    try {
      await connectDB();
    } catch (dbError) {
      console.warn('⚠ Database connection failed. Some features will not work.');
      console.warn('  Please ensure MongoDB is running: mongod');
      console.warn('  Or setup MongoDB Atlas and update MONGODB_URI in .env');
    }
    
    initEmailService();
    startReminderScheduler();

    app.listen(config.port, () => {
      console.log(`\n🌙 Tonight's Sky Backend`);
      console.log(`🚀 Server running on http://localhost:${config.port}`);
      console.log(`📧 Email service: ${config.emailService}`);
      console.log(`💾 Database: ${config.mongodbUri.split('?')[0]}`);
      console.log('');
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  stopReminderScheduler();
  await disconnectDB();
  process.exit(0);
});

start();
