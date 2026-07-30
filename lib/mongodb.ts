import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;

    cached.promise = (async () => {
      // 1. Jika MongoDB Atlas / Custom URI diset (misal di Vercel atau environment prod/staging)
      if (uri && !uri.includes("127.0.0.1") && !uri.includes("localhost")) {
        return await mongoose.connect(uri, { bufferCommands: false });
      }

      // 2. Coba hubungkan ke local MongoDB daemon jika aktif
      const targetLocalUri = uri || "mongodb://127.0.0.1:27017/mpk-smkn7";
      try {
        const opts = { bufferCommands: false, serverSelectionTimeoutMS: 1500 };
        const conn = await mongoose.connect(targetLocalUri, opts);
        return conn;
      } catch (localErr) {
        // 3. Fallback ke In-Memory MongoDB Server jika di lokal & mongodb daemon tidak aktif
        if (process.env.NODE_ENV !== "production") {
          console.log("⚡ MongoDB lokal tidak aktif. Mengaktifkan In-Memory MongoDB Server...");
          const pkgName = "mongodb-memory-server";
          // Dynamic require bundler-safe
          const { MongoMemoryServer } = eval(`require("${pkgName}")`);
          const mongod = await MongoMemoryServer.create();
          const memUri = mongod.getUri();
          return await mongoose.connect(memUri, { bufferCommands: false });
        }
        throw localErr;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
