import { Router } from "express";

import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.post("/", createNote);
router.get("/", getNotes);

router
  .route("/:id")
  .get(getNote)
  .put(updateNote)
  .delete(deleteNote);

export default router;