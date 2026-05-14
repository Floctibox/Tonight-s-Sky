import express from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { sendWelcomeEmail } from '../services/emailService.js';

const router = express.Router();

// Validation middleware
const validateEmail = body('email')
  .isEmail()
  .withMessage('Valid email is required')
  .isLength({ max: 254 })
  .withMessage('Email is too long')
  .normalizeEmail({ gmail_remove_dots: false }); // Keep dots in Gmail addresses

const validatePassword = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters');

const validateRegisterName = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
];

const validateLoginPassword = body('password')
  .notEmpty()
  .withMessage('Password is required');

// Register endpoint
router.post(
  '/register',
  [validateEmail, validatePassword, ...validateRegisterName],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const { email, password, username } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });

      if (existingUser) {
        if (existingUser.email === email) {
          return res.status(400).json({
            error: 'Email already registered',
          });
        }
        return res.status(400).json({
          error: 'Username already taken',
        });
      }

      // Create new user
      const user = new User({
        email,
        password,
        username,
      });

      await user.save();

      // Send welcome email
      await sendWelcomeEmail(user);

      // Generate token
      const token = generateToken(user._id.toString());

      return res.status(201).json({
        message: 'Account created successfully',
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      return next(error);
    }
  }
);

// Login endpoint
router.post(
  '/login',
  [validateEmail, validateLoginPassword],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          error: 'Invalid email or password',
        });
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Invalid email or password',
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user._id.toString());

      return res.json({
        message: 'Logged in successfully',
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      return next(error);
    }
  }
);

export default router;