import { Lead } from "../models/Leads.js";
import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/apiError.js";

import {
  generateLeadAssessment,
  generateFollowupEmail,
  summarizeMeeting,
  generateText,
} from "../services/ai.service.js";

// ========================================
// AI Status
// ========================================
export const aiStatus = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    provider: "Google Gemini",
    configured: !!process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  });
});

// ========================================
// Analyze Lead
// ========================================
export const analyzeLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }

  const result = await generateLeadAssessment(lead);

  res.json({
    success: true,
    result,
  });
});

// ========================================
// Generate Email Draft
// ========================================
export const generateEmail = asyncHandler(async (req, res) => {
  const lead = await Lead.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }

  const result = await generateFollowupEmail(lead);

  res.json({
    success: true,
    result,
  });
});

// ========================================
// Summarize Meeting Notes
// ========================================
export const summarizeNotes = asyncHandler(async (req, res) => {
  const { notes } = req.body;

  if (!notes) {
    throw new ApiError(400, "Meeting notes are required");
  }

  const result = await summarizeMeeting(notes);

  res.json({
    success: true,
    result,
  });
});

// ========================================
// Generate Task List
// ========================================
export const generateTaskList = asyncHandler(async (req, res) => {
  const leads = await Lead.find({
    owner: req.user._id,
  });

  const prompt = `
You are a CRM assistant.

Generate today's priority task list.

${JSON.stringify(leads)}

Return only plain text.
`;

  const result = await generateText(prompt);

  res.json({
    success: true,
    result,
  });
});

// ========================================
// Sales Insights
// ========================================
export const salesInsights = asyncHandler(async (req, res) => {
  let stats = req.body.stats;

  if (!stats) {
    const leads = await Lead.find({
      owner: req.user._id,
    });

    stats = buildPipelineStats(leads);
  }

  const prompt = `
You are an expert sales analyst.

Analyze these CRM statistics and provide:

- Overall health
- Bottlenecks
- Recommendations
- Next actions

${JSON.stringify(stats)}
`;

  const result = await generateText(prompt);

  res.json({
    success: true,
    result,
  });
});

// ========================================
// Helper Function
// ========================================
const buildPipelineStats = (leads) => {
  const byStage = {};
  let totalValue = 0;

  for (const lead of leads) {
    if (!byStage[lead.status]) {
      byStage[lead.status] = {
        count: 0,
        value: 0,
      };
    }

    byStage[lead.status].count++;
    byStage[lead.status].value += lead.value || 0;

    totalValue += lead.value || 0;
  }

  const won = byStage.Won?.count || 0;
  const lost = byStage.Lost?.count || 0;

  return {
    totalLeads: leads.length,
    totalPipelineValue: totalValue,
    winRate:
      won + lost > 0
        ? Math.round((won / (won + lost)) * 100)
        : 0,
    stages: byStage,
  };
};