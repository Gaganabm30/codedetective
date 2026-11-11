import mongoose from 'mongoose';

const AttemptSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    challengeId: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    status: { type: String, enum: ['PASSED', 'FAILED', 'IN_PROGRESS'], default: 'IN_PROGRESS' },
    score: { type: Number, default: 0 },
    testsPassed: { type: Number, default: 0 },
    testsTotal: { type: Number, default: 0 },
    timeSpent: { type: String, default: '0s' },
    hintsUsed: { type: Number, default: 0 },
    submittedFiles: [
      {
        path: String,
        code: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Attempt || mongoose.model('Attempt', AttemptSchema);

