# Tonight's Sky Backend API

REST API for the Tonight's Sky astronomy PWA with authentication, event management, and email reminders.

## Features

- 🔐 JWT-based authentication
- 👤 User account management
- 📍 Favorite locations storage
- 🌟 Saved events with reminders
- 📧 Automated email notifications
- 🔄 Cron-based job scheduling

## Tech Stack

- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Email**: Nodemailer (Gmail/SendGrid)
- **Scheduling**: node-cron
- **Security**: bcryptjs (password hashing)

## Installation

```bash
npm install
```

## Configuration

Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/astral-observer

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=7d

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@astral-observer.com

# Frontend
FRONTEND_URL=http://localhost:5173
```

## Running the Server

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

Server starts on `http://localhost:5000` by default.

## Database Setup

### Option 1: Local MongoDB

```bash
# macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu/Debian)
sudo apt-get install mongodb
sudo service mongod start

# Windows
# Download from mongodb.com/try/download/community
# Run installer and MongoDB will start as service
```

### Option 2: MongoDB Atlas (Cloud)

1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster (free tier M0)
3. Get connection string
4. Replace `MONGODB_URI` in `.env`

Example:
```
mongodb+srv://username:password@cluster.mongodb.net/astral-observer?retryWrites=true&w=majority
```

## Email Configuration

### Gmail Setup (Recommended)

1. Enable 2-Factor Authentication: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Copy 16-character password
5. Set in `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

### SendGrid Setup (Alternative)

1. Create account: https://sendgrid.com
2. Create API key
3. Set in `.env`:
   ```
   SENDGRID_API_KEY=SG.xxxxx
   EMAIL_SERVICE=sendgrid
   ```

## Security

### Password Hashing
- Uses bcryptjs with 10 salt rounds
- Passwords never stored in plain text
- Passwords never returned in API responses

### JWT Tokens
- Signed with `JWT_SECRET` env variable
- Expires after `JWT_EXPIRY` duration
- Required for authenticated endpoints

### Production Checklist
- [ ] Change JWT_SECRET to random string
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Enable rate limiting
- [ ] Use environment variable service (not .env files)
- [ ] Enable MongoDB authentication
- [ ] Setup monitoring/logging
- [ ] Regular backups

## Project Structure

```
src/
├── server.js           # Main server file
├── config/
│   ├── database.js     # MongoDB connection
│   └── env.js          # Environment config
├── models/
│   └── User.js         # User schema
├── routes/
│   ├── authRoutes.js   # Auth endpoints
│   ├── userRoutes.js   # User endpoints
│   ├── favoritesRoutes.js  # Favorites endpoints
│   └── eventsRoutes.js # Events endpoints
├── services/
│   ├── emailService.js      # Email sending
│   └── reminderService.js   # Reminder scheduling
└── middleware/
    ├── auth.js         # JWT verification
    └── errorHandler.js # Error handling
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `MongooseError: Cannot connect` | Check MONGODB_URI and MongoDB is running |
| `JWT token not valid` | JWT_SECRET mismatch or token expired |
| `Email not sending` | Check email credentials and SMTP settings |
| `CORS error` | Add frontend URL to CORS config |
| `Port already in use` | Change PORT or kill process using it |

For detailed API documentation and usage examples, see [ACCOUNT_SYSTEM_README.md](../ACCOUNT_SYSTEM_README.md).
