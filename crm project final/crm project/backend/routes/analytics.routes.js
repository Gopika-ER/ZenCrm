import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getOverview } from "../controllers/analytics.controller.js";

const router = Router();

router.use(protect);

router.get("/overview", getOverview);

export default router;