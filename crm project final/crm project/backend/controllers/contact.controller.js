import { Contact } from "../models/Contact.js";
import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/apiError.js";


// Get All Contacts
export const getContacts = asyncHandler(async (req, res) => {
  const { search, tag } = req.query;

  const filter = {
    owner: req.user._id,
  };

  if (tag) {
    filter.tags = tag;
  }

  if (search) {
    const rx = new RegExp(search, "i");

    filter.$or = [
      { firstName: rx },
      { lastName: rx },
      { email: rx },
      { company: rx },
      { phone: rx },
    ];
  }

  const contacts = await Contact.find(filter).sort({
    favorite: -1,
    firstName: 1,
  });

  res.json({
    success: true,
    count: contacts.length,
    contacts,
  });
});

// Get Single Contact
export const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  res.json({
    success: true,
    contact,
  });
});

// Create Contact
export const createContact = asyncHandler(async (req, res) => {
  const contact = await Contact.create({
    ...req.body,
    owner: req.user._id,
  });

  res.status(201).json({
    success: true,
    contact,
  });
});

// Update Contact
export const updateContact = asyncHandler(async (req, res) => {
  const { owner, ...updates } = req.body;

  const contact = await Contact.findOneAndUpdate(
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

  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  res.json({
    success: true,
    contact,
  });
});

// Delete Contact
export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!contact) {
    throw new ApiError(404, "Contact not found");

  }

  res.json({
    success: true,
    message: "Contact deleted",
  });
});