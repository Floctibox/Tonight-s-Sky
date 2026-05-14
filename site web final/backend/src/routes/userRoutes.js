import express from 'express';
import { User } from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { username, emailNotificationsEnabled } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        ...(username && { username }),
        ...(emailNotificationsEnabled !== undefined && { emailNotificationsEnabled }),
      },
      { new: true }
    );

    res.json({ message: 'Profile updated', user: user.toJSON() });
  } catch (error) {
    next(error);
  }
});

export default router;
