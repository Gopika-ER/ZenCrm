
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

// API Routes
import authRoutes from "./routes/auth.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import noteRoutes from "./routes/note.routes.js";
import taskRoutes from "./routes/task.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();

/* ------------------------- Middleware ------------------------- */

const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (e.g. server-side requests)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* ------------------------- Root Route ------------------------- */

// Root URL: https://your-backend.onrender.com/
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Zen CRM API is running",
  });
});

/* ------------------------- Health Check ------------------------- */

// Health URL: /api/health
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    service: "CRM",
  });
});

/* ------------------------- API Routes ------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);

/* ------------------------- Error Handling ------------------------- */

// Keep these AFTER all valid routes
app.use(notFound);
app.use(errorHandler);

/* ------------------------- Start Server ------------------------- */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Zen CRM API running on port ${PORT}`);
      console.log("MongoDB connection initialized");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;
