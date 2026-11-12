import mongoose from 'mongoose';

/**
 * Sanitizes MongoDB URI in case angle brackets from connection string templates
 * (e.g. mongodb+srv://<username>:<password>@...) were retained in .env
 */
export function sanitizeMongoUri(rawUri) {
  if (!rawUri || typeof rawUri !== 'string') return rawUri;
  const match = rawUri.match(/^mongodb(\+srv)?:\/\/([^:]+):([^@]+)@([^/?]+)(\/[^?]*)?(\?.*)?$/);
  if (!match) return rawUri;
  let user = match[2];
  let pass = match[3];
  if (user.startsWith('<') && user.endsWith('>')) {
    user = user.slice(1, -1);
  }
  if (pass.startsWith('<') && pass.endsWith('>')) {
    pass = pass.slice(1, -1);
  }
  const dbPart = match[5] && match[5] !== '/' ? match[5] : '/codedetective';
  return `mongodb${match[1] || ''}://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${match[4]}${dbPart}${match[6] || ''}`;
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const rawUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codedetective';
  const cleanUri = sanitizeMongoUri(rawUri);

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(cleanUri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`✅ [MongoDB] Connected successfully to database: ${mongoose.connection.name}`);
  } catch (err) {
    console.warn(`⚠️ [MongoDB] Connection error: ${err.message}`);
    console.warn(`ℹ️ [CodeDetective] Server running. Please check MongoDB network/credentials.`);
  }
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

export async function ensureDbConnected() {
  if (mongoose.connection.readyState === 1) {
    return true;
  }
  if (mongoose.connection.readyState === 2) {
    try {
      await mongoose.connection.asPromise();
      return mongoose.connection.readyState === 1;
    } catch (e) {
      // Fall through to reconnect
    }
  }
  await connectDB();
  return mongoose.connection.readyState === 1;
}

export function getDbHealth() {
  return {
    connected: isDbConnected(),
    readyState: mongoose.connection.readyState,
    databaseName: isDbConnected() ? mongoose.connection.name : null,
  };
}
