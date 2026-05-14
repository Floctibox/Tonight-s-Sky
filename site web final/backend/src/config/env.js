import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/astral-observer',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  jwtExpiry: process.env.JWT_EXPIRY || '7d',
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASSWORD,
  emailFrom: process.env.EMAIL_FROM || 'noreply@astral-observer.com',
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  emailService: process.env.EMAIL_SERVICE || 'gmail',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

export function validateConfig() {
  const requiredFields = [
    'mongodbUri',
    'jwtSecret',
  ];

  const missing = requiredFields.filter(field => !config[field]);
  if (missing.length > 0) {
    console.warn(`⚠ Missing configuration: ${missing.join(', ')}`);
  }
}
