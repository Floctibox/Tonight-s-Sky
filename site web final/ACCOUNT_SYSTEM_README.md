# Tonight's Sky - Account & Events System

A complete account creation, login, and event management system for the Tonight's Sky astronomy PWA.

## Features

✅ **User Authentication**
- Email/password account creation
- Secure login with JWT tokens
- Session persistence

✅ **Event Management**
- Save upcoming astronomical events
- Track meteor showers, eclipses, full moons, etc.
- Personal notes for each event

✅ **Email Reminders**
- Automatic email reminders 1 day before saved events
- Configurable notification preferences
- Scheduled via cron jobs

✅ **Favorite Locations**
- Save favorite observation locations
- Quick access for location switching
- Store latitude, longitude, timezone info

✅ **User Profile**
- Edit profile information
- Manage notification preferences
- View upcoming saved events

## Architecture

### Backend (Node.js + Express + MongoDB)
- REST API with JWT authentication
- User model with saved events and favorites
- Email service with nodemailer/SendGrid
- Cron-based email reminder scheduler

### Frontend (React)
- Auth context for global state management
- Custom hooks for API interactions
- Modal-based auth UI
- Profile and favorites management panels

## Setup Instructions

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/astral-observer
   JWT_SECRET=your_secret_key_here
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   FRONTEND_URL=http://localhost:5173
   ```

3. **MongoDB Setup:**
   - **Option A: Local MongoDB**
     ```bash
     # Install MongoDB Community Edition
     # Start MongoDB service
     mongod
     ```
   
   - **Option B: MongoDB Atlas (Cloud)**
     1. Create account at https://www.mongodb.com/cloud/atlas
     2. Create a cluster
     3. Copy connection string to MONGODB_URI
     ```
     mongodb+srv://user:password@cluster.mongodb.net/astral-observer?retryWrites=true&w=majority
     ```

4. **Email Configuration:**

   **Gmail Setup:**
   - Enable 2-Factor Authentication on your Google account
   - Generate an [App Password](https://myaccount.google.com/apppasswords)
   - Use the app password as `EMAIL_PASSWORD`
   - Set `EMAIL_SERVICE=gmail`

   **SendGrid Setup (Alternative):**
   - Create account at https://sendgrid.com
   - Generate API key
   - Set `SENDGRID_API_KEY` in `.env`
   - Set `EMAIL_SERVICE=sendgrid`

5. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5000

### Frontend Setup

1. **The auth context is already integrated** - no additional setup needed

2. **Update backend URL if needed:**
   - In `src/services/apiClient.js`, update `API_BASE_URL` if backend is on different port/domain

3. **Start the frontend (from astral-observer-pwa directory):**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile

### Favorites
- `GET /api/favorites` - Get all favorites
- `POST /api/favorites` - Add favorite
- `PUT /api/favorites/:id` - Update favorite
- `DELETE /api/favorites/:id` - Delete favorite

### Events
- `GET /api/events` - Get all saved events
- `GET /api/events/upcoming` - Get upcoming events
- `POST /api/events` - Save event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

## Request/Response Examples

### Register
```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securepassword123",
  "username": "johndoe"
}

Response:
{
  "message": "Account created successfully",
  "token": "eyJhbGc...",
  "user": { /* user object */ }
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response:
{
  "message": "Logged in successfully",
  "token": "eyJhbGc...",
  "user": { /* user object */ }
}
```

### Save Event
```bash
POST /api/events
Authorization: Bearer <token>
{
  "eventType": "meteor_shower",
  "title": "Perseid Meteor Shower",
  "description": "Peak viewing between August 11-13",
  "eventDate": "2026-08-12T22:00:00Z",
  "reminderEnabled": true,
  "notes": "Plan to go to Mount Tamalpais"
}

Response:
{
  "message": "Event saved",
  "event": { /* event object */ }
}
```

### Add Favorite Location
```bash
POST /api/favorites
Authorization: Bearer <token>
{
  "name": "Mount Tamalpais",
  "latitude": 37.7265,
  "longitude": -122.5972,
  "country": "USA",
  "region": "CA",
  "timezone": "America/Los_Angeles"
}

Response:
{
  "message": "Favorite added",
  "favorite": { /* favorite object */ }
}
```

## Email Reminders

The system automatically checks for upcoming events daily at **8:00 AM** (configurable in `src/services/reminderService.js`):

1. Finds all events scheduled for tomorrow
2. For users with reminders enabled
3. Sends personalized email reminder
4. Marks reminder as sent to avoid duplicates

### Email Template Features
- Event title and type
- Event date and time
- User's personal notes
- Link back to the app
- Professional design

## Troubleshooting

### Backend won't connect to MongoDB
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- For Atlas, ensure IP is whitelisted

### Emails not sending
- Check email configuration in `.env`
- Gmail: Verify app password is correct
- SendGrid: Verify API key is valid
- Check console logs for errors

### Frontend can't reach backend
- Ensure backend is running on `http://localhost:5000`
- Check `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check browser console for CORS errors

### Email reminders not running
- Ensure backend server is running
- Check `node-cron` is installed: `npm ls node-cron`
- Verify database has saved events

## Security Notes

⚠️ **For Production:**
- Change `JWT_SECRET` to a strong random string
- Enable HTTPS
- Use environment variables from secure config service
- Set secure CORS origins
- Enable rate limiting
- Use secure database credentials
- Never commit `.env` file to git

## Database Schema

### User Document
```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase),
  password: String (hashed),
  username: String (unique),
  emailNotificationsEnabled: Boolean,
  lastLogin: Date,
  favorites: [
    {
      _id: ObjectId,
      name: String,
      latitude: Number,
      longitude: Number,
      country: String,
      region: String,
      timezone: String,
      addedAt: Date
    }
  ],
  savedEvents: [
    {
      _id: ObjectId,
      eventType: String,
      title: String,
      description: String,
      eventDate: Date,
      location: { name, latitude, longitude },
      reminderEnabled: Boolean,
      reminderSent: Boolean,
      reminderSentAt: Date,
      notes: String,
      addedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## Development

### Run backend in development mode
```bash
cd backend
npm run dev
```
Uses `--watch` flag to auto-restart on file changes.

### Run frontend in development mode
```bash
cd astral-observer-pwa
npm run dev
```

### Testing Email Sending
Manually trigger reminders in backend:
```javascript
// Add to reminderService.js exports
app.post('/api/test/send-reminders', async (req, res) => {
  await triggerRemindersNow();
  res.json({ message: 'Reminders triggered' });
});
```

## Future Enhancements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Social media login (Google, GitHub)
- [ ] Event sharing
- [ ] Calendar integration
- [ ] Location-based notifications
- [ ] Push notifications (PWA)
- [ ] Event categories and tags
- [ ] Event collaboration with other users

## Support

For issues or questions, check:
1. Console logs in browser and terminal
2. MongoDB connection string format
3. Email service configuration
4. CORS and network requests
5. JWT token validity

---

Built with ❤️ for astronomy enthusiasts everywhere.
