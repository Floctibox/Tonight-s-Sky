import express from 'express';
import { User } from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all favorites
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ favorites: user.favorites });
  } catch (error) {
    next(error);
  }
});

// Add favorite location
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { name, latitude, longitude, country, region, timezone } = req.body;

    if (!name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Name, latitude, and longitude are required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const favorite = {
      name,
      latitude,
      longitude,
      country,
      region,
      timezone,
      addedAt: new Date(),
    };

    user.favorites.push(favorite);
    await user.save();

    res.status(201).json({
      message: 'Favorite added',
      favorite: user.favorites[user.favorites.length - 1],
    });
  } catch (error) {
    next(error);
  }
});

// Update favorite
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, timezone } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const favorite = user.favorites.id(id);
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    if (name) favorite.name = name;
    if (timezone) favorite.timezone = timezone;

    await user.save();

    res.json({ message: 'Favorite updated', favorite });
  } catch (error) {
    next(error);
  }
});

// Delete favorite
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.favorites.id(id).deleteOne();
    await user.save();

    res.json({ message: 'Favorite deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
