import { Router } from "express";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTask,
} from "../controllers/task.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.route("/")
  .get(getTasks)
  .post(createTask);

router.route("/:id")
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

export default router;