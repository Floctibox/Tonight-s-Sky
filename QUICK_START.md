# Quick Start Guide - Tonight's Sky Account System

## 🚀 5-Minute Setup

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas cloud)
- Gmail account (for email) or SendGrid API key

### Step 1: Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb://localhost:27017/astral-observer
JWT_SECRET=change-this-to-random-string
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
```

Start backend:
```bash
npm run dev
```

✅ You should see: `🚀 Server running on http://localhost:5000`

### Step 2: Setup Frontend

```bash
cd astral-observer-pwa
npm install
npm run dev
```

✅ App opens at `http://localhost:5173`

### Step 3: Test It!

1. Click **"Sign Up"** button
2. Create account with test email
3. Login
4. Click **"⭐ Favorites"** to save a location
5. Click **"📅 Save Event"** to create an event
6. Check your email in ~1 day for reminder (or manually trigger in development)

---

## 🔑 Getting Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select Mail → Windows Computer (or your setup)
5. Copy the 16-character password to `EMAIL_PASSWORD` in `.env`

---

## 📦 MongoDB Atlas Setup (No Local Install)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Click "Create a Cluster"
4. Choose free tier (M0)
5. Click "Connect" → "Connect your application"
6. Copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/astral-observer?retryWrites=true&w=majority
   ```
7. Paste to `MONGODB_URI` in `.env`

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `ECONNREFUSED localhost:27017` | MongoDB not running. Run `mongod` or use MongoDB Atlas |
| `401 Invalid token` | Clear browser localStorage, login again |
| `Email not sending` | Check email config, verify Gmail app password |
| `CORS Error` | Ensure frontend URL matches `FRONTEND_URL` in backend `.env` |

---

## 📚 API Examples

### Create Account
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123",
    "username":"johndoe"
  }'
```

### Save Event
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "eventType":"meteor_shower",
    "title":"Perseid Meteor Shower",
    "eventDate":"2026-08-12T22:00:00Z",
    "reminderEnabled":true
  }'
```

---

## 🎯 Features to Test

- [ ] Create account and sign up
- [ ] Login/logout
- [ ] Save favorite location
- [ ] Save astronomical event
- [ ] Edit profile
- [ ] Toggle email reminders
- [ ] Delete event/favorite
- [ ] Email reminder received

---

## 📝 Environment Variables Reference

| Variable | Example | Notes |
|----------|---------|-------|
| `PORT` | 5000 | Backend server port |
| `MONGODB_URI` | mongodb://localhost:27017/db | Local or Atlas |
| `JWT_SECRET` | super-secret-key | Change to random string in production |
| `EMAIL_USER` | user@gmail.com | Gmail address |
| `EMAIL_PASSWORD` | xxxx xxxx xxxx xxxx | Gmail app password (16 chars) |
| `FRONTEND_URL` | http://localhost:5173 | Where frontend runs |

---

## 📞 Need Help?

Check:
1. Backend console for errors
2. Browser DevTools Network tab
3. MongoDB connection
4. Email configuration
5. Firewall/proxy settings

---

Created with ❤️ for stargazers
