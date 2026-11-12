import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name or handle is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    avatar: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    role: {
      type: String,
      enum: ['Developer', 'Admin', 'Mentor'],
      default: 'Developer',
    },
    totalXP: {
      type: Number,
      default: 0,
      min: [0, 'XP cannot be negative'],
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: [1, 'Level starts at 1'],
    },
    currentStreak: {
      type: Number,
      default: 1,
      min: [0, 'Streak cannot be negative'],
    },
    streak: {
      type: Number,
      default: 1,
    },
    longestStreak: {
      type: Number,
      default: 1,
    },
    solvedChallenges: {
      type: [String],
      default: [],
    },
    completedChallenges: {
      type: [String],
      default: [],
    },
    accuracy: {
      type: Number,
      default: 100,
      min: [0, 'Accuracy cannot be below 0'],
      max: [100, 'Accuracy cannot exceed 100'],
    },
    solvedCount: {
      type: Number,
      default: 0,
    },
    badges: [
      {
        id: String,
        name: String,
        icon: String,
        description: String,
        unlockedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
UserSchema.pre('save', async function (next) {
  // Sync compatibility fields
  if (this.totalXP !== undefined && this.xp === undefined) this.xp = this.totalXP;
  if (this.xp !== undefined && this.totalXP === undefined) this.totalXP = this.xp;
  if (this.currentStreak !== undefined && this.streak === undefined) this.streak = this.currentStreak;
  if (this.streak !== undefined && this.currentStreak === undefined) this.currentStreak = this.streak;
  if (this.solvedChallenges && (!this.completedChallenges || !this.completedChallenges.length)) {
    this.completedChallenges = this.solvedChallenges;
  }
  if (this.completedChallenges && (!this.solvedChallenges || !this.solvedChallenges.length)) {
    this.solvedChallenges = this.completedChallenges;
  }
  if (this.solvedChallenges) {
    this.solvedCount = this.solvedChallenges.length;
  }

  // Calculate dynamic level: every 400 XP = +1 Level
  const currentXP = this.totalXP || this.xp || 0;
  this.level = Math.max(1, Math.floor(currentXP / 400) + 1);

  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare candidate password with stored hash
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// Return safe user object omitting password
UserSchema.methods.toSafeObject = function () {
  const effectiveXP = this.totalXP !== undefined ? this.totalXP : (this.xp || 0);
  const effectiveStreak = this.currentStreak !== undefined ? this.currentStreak : (this.streak || 1);
  const effectiveSolved = this.solvedChallenges && this.solvedChallenges.length
    ? this.solvedChallenges
    : (this.completedChallenges || []);

  return {
    id: this._id ? this._id.toString() : this.id,
    _id: this._id ? this._id.toString() : this.id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    totalXP: effectiveXP,
    xp: effectiveXP,
    level: this.level || 1,
    currentStreak: effectiveStreak,
    streak: effectiveStreak,
    longestStreak: this.longestStreak || effectiveStreak,
    solvedChallenges: effectiveSolved,
    completedChallenges: effectiveSolved,
    solvedCount: effectiveSolved.length,
    accuracy: this.accuracy !== undefined ? this.accuracy : 100,
    badges: this.badges || [],
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
