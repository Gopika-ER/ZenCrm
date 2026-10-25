import { Router } from "express";

import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contact.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all contact routes
router.use(protect);

// Create Contact
router.post("/", createContact);

// Get All Contacts
router.get("/", getContacts);

// Get, Update and Delete Contact by ID
router
  .route("/:id")
  .get(getContact)
  .put(updateContact)
  .delete(deleteContact);

export default router;