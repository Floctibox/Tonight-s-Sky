import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    favorites: [
      {
        name: {
          type: String,
          required: true,
        },
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
        country: String,
        region: String,
        timezone: String,
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    savedEvents: [
      {
        eventType: {
          type: String,
          enum: ['meteor_shower', 'eclipse', 'full_moon', 'new_moon', 'planetary_alignment', 'lunar_event', 'conjunction', 'other'],
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: String,
        eventDate: {
          type: Date,
          required: true,
        },
        location: {
          name: String,
          latitude: Number,
          longitude: Number,
        },
        reminderEnabled: {
          type: Boolean,
          default: true,
        },
        reminderSent: {
          type: Boolean,
          default: false,
        },
        reminderSentAt: Date,
        notes: String,
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    emailNotificationsEnabled: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationTokenExpiry: Date,
    lastLogin: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcryptjs.compare(password, this.password);
};

// Method to get public user data
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationToken;
  delete user.emailVerificationTokenExpiry;
  return user;
};

export const User = mongoose.model('User', userSchema);
