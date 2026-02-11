import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_DB_URI || "";

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// We are declaring a new variable inside global scope
// Type augmentation: adds mongooseCache to the global scope type definition
// so TypeScript does not throw an error when accessing global.mongooseCache.
// `var` binds to global scope; `let`/`const` do not.

// Get cached connection from global scope (persists across module reloads)
let cached = global.mongooseCache;

// Initialize cache if not present (first run or after server restart)
if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDB = async () => {
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGO_DB_URI environment variable inside .env",
    );
  }

  // If already connected, return the connection
  if (cached.conn) {
    return cached.conn;
  }

  // If not connecting yet, start the connection
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log(`✅ MongoDB connected in ${process.env.NODE_ENV} mode`);
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }

  return cached.conn;
};
