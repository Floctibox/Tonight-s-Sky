import mongoose from 'mongoose';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

export async function connectDB() {
  try {
    const connectPromise = mongoose.connect(process.env.MONGODB_URI, {
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });

    // Add timeout to connection attempt
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('MongoDB connection timeout')), 6000)
    );

    await Promise.race([connectPromise, timeoutPromise]);
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    throw error;
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('✗ MongoDB disconnection failed:', error.message);
  }
}
