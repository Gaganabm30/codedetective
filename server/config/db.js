import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codedetective';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB] Connected successfully to: ${uri}`);
  } catch (err) {
    isConnected = false;
    console.warn(`⚠️ [MongoDB] Local database connection timed out or unavailable (${err.message}).`);
    console.warn(`ℹ️ [CodeDetective] Operating in Resilient In-Memory Mode with full persistence & sample data.`);
  }
}

export function isDbConnected() {
  return isConnected;
}
