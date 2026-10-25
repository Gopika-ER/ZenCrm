import mongoose from "mongoose";

export const LEAD_STATUS = [
  "New",
  "Qualified",
  "Proposal",
  "Won",
  "Lost",
];

export const LEAD_PRIORITIES = [
  "Low",
  "Medium",
  "High",
];

const leadSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    company: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: LEAD_STATUS,
      default: "New",
      index: true,
    },

    priority: {
      type: String,
      enum: LEAD_PRIORITIES,
      default: "Medium",
    },

    source: {
      type: String,
      enum: [
        "Website",
        "Referral",
        "Cold Outreach",
        "Social",
        "Event",
        "Other",
      ],
      default: "Other",
    },

    value: {
      type: Number,
      default: 0,
      min: 0,
    },

    notes: {
      type: String,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },

    assignedTo: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: null,
    },

    followUpDate: {
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster searching
leadSchema.index({ owner: 1, status: 1 });
leadSchema.index({ owner: 1, priority: 1 });
leadSchema.index({ owner: 1, company: 1 });
leadSchema.index({ owner: 1, createdAt: -1 });

export const Lead = mongoose.model("Lead", leadSchema);