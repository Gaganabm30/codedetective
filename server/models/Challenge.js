import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema(
  {
    challengeId: { type: String, required: true, unique: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true }, // 'Full Stack', 'Frontend', 'React', 'Backend', 'Node.js', 'JavaScript', 'Database', 'DSA'
    technology: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    type: { type: String, enum: ['Code Snippet', 'Multi-file Project'], default: 'Multi-file Project' },
    filesCount: { type: Number, default: 1 },
    testCasesCount: { type: Number, default: 1 },
    timeEstimate: { type: String, default: '20 min' },
    xp: { type: Number, default: 150 },
    tags: [{ type: String }],
    shortDescription: { type: String, required: true },
    instructions: { type: String, required: true },
    hints: [
      {
        level: Number,
        title: String,
        text: String,
      },
    ],
    initialFiles: [
      {
        path: String,
        name: String,
        language: String,
        code: String,
      },
    ],
    testCases: [
      {
        id: String,
        name: String,
        description: String,
        hidden: Boolean,
        testRunnerCode: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Challenge || mongoose.model('Challenge', ChallengeSchema);

