import { Note } from "../models/Notes.js";

import { asyncHandler } from "../utils/asynHandler.js";

import { ApiError } from "../utils/apiError.js";

// Get All Notes
export const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({
    owner: req.user._id,
  }).sort({
    isPinned: -1,
    createdAt: -1,
  });

  res.json({
    success: true,
    count: notes.length,
    notes,
  });
});

// Get Single Note
export const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  res.json({
    success: true,
    note,
  });
});

// Create Note
export const createNote = asyncHandler(async (req, res) => {
  const note = await Note.create({
    ...req.body,
    owner: req.user._id,
  });

  res.status(201).json({
    success: true,
    note,
  });
});

// Update Note
export const updateNote = asyncHandler(async (req, res) => {
  const { owner, ...updates } = req.body;

  const note = await Note.findOneAndUpdate(
    {
      _id: req.params.id,
      owner: req.user._id,
    },
    updates,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  res.json({
    success: true,
    note,
  });
});

// Delete Note
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  res.json({
    success: true,
    message: "Note deleted",
  });
});