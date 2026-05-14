import express from 'express';
import { User } from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all saved events
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ events: user.savedEvents });
  } catch (error) {
    next(error);
  }
});

// Get upcoming events
router.get('/upcoming', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const now = new Date();
    const upcomingEvents = user.savedEvents.filter(event => new Date(event.eventDate) > now);

    res.json({ events: upcomingEvents.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)) });
  } catch (error) {
    next(error);
  }
});

// Add saved event
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { eventType, title, description, eventDate, location, notes, reminderEnabled } = req.body;

    if (!eventType || !title || !eventDate) {
      return res.status(400).json({ error: 'Event type, title, and date are required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const event = {
      eventType,
      title,
      description,
      eventDate: new Date(eventDate),
      location,
      reminderEnabled: reminderEnabled !== false,
      reminderSent: false,
      notes,
      addedAt: new Date(),
    };

    user.savedEvents.push(event);
    await user.save();

    res.status(201).json({
      message: 'Event saved',
      event: user.savedEvents[user.savedEvents.length - 1],
    });
  } catch (error) {
    next(error);
  }
});

// Update saved event
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, eventDate, location, notes, reminderEnabled } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const event = user.savedEvents.id(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (title) event.title = title;
    if (description !== undefined) event.description = description;
    if (eventDate) event.eventDate = new Date(eventDate);
    if (location) event.location = location;
    if (notes !== undefined) event.notes = notes;
    if (reminderEnabled !== undefined) event.reminderEnabled = reminderEnabled;

    await user.save();

    res.json({ message: 'Event updated', event });
  } catch (error) {
    next(error);
  }
});

// Delete saved event
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.savedEvents.id(id).deleteOne();
    await user.save();

    res.json({ message: 'Event deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
