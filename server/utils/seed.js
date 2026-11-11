import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';
import { SERVER_CHALLENGES } from './seedData.js';

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codedetective';
  console.log(`Connecting to ${uri}...`);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log('Connected to MongoDB. Seeding challenges...');

    for (const ch of SERVER_CHALLENGES) {
      await Challenge.findOneAndUpdate(
        { challengeId: ch.id || ch.challengeId },
        { ...ch, challengeId: ch.id || ch.challengeId },
        { upsert: true, new: true }
      );
      console.log(`Seeded challenge: ${ch.title}`);
    }

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.warn('Seeding skipped (MongoDB not reachable):', err.message);
    process.exit(0);
  }
}

seed();

