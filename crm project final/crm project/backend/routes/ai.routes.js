import { Router } from "express";
import { getOverview } from "../controllers/analytics.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all analytics routes
router.use(protect);

// Dashboard Overview
router.get("/overview", getOverview);

export default router;