import { Router } from "express";
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  reorderLeads,
} from "../controllers/lead.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all lead routes
router.use(protect);

// Lead routes
router.post("/", createLead);
router.get("/", getLeads);
router.post("/reorder", reorderLeads);
router
  .route("/:id")
  .get(getLead)
  .put(updateLead)
  .delete(deleteLead);

export default router;