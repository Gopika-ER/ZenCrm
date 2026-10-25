import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGO_URL;

  if (!uri) {
    throw new Error("MONGO_URI or MONGO_URL is not defined in environment variables");
  }

  // Avoid deprecation noise & make queries fail fast instead of buffering forever.
  mongoose.set("strictQuery", true);

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
  });

  console.log(
    `🟢 MongoDB connected: ${conn.connection.host}/${conn.connection.name}`
  );

  return conn;
};