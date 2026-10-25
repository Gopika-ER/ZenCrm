import { Lead } from "../models/Leads.js";
import { Contact } from "../models/Contact.js";
import { Task } from "../models/Task.js";
import { asyncHandler } from "../utils/asynHandler.js";

// ======================================
// Dashboard Overview
// ======================================
export const getOverview = asyncHandler(async (req, res) => {
  const owner = req.user._id;

  const [leads, contactCount, openTasks] = await Promise.all([
    Lead.find({ owner }),
    Contact.countDocuments({ owner }),
    Task.countDocuments({
      owner,
      status: { $ne: "Completed" },
    }),
  ]);

  // Pipeline Stages
  const stages = [
    "New",
    "Qualified",
    "Proposal",
    "Won",
    "Lost",
  ];

  const byStage = Object.fromEntries(
    stages.map((s) => [
      s,
      {
        count: 0,
        value: 0,
      },
    ])
  );

  let totalValue = 0;
  let wonValue = 0;

  // ==========================
  // Pipeline Summary
  // ==========================
  for (const lead of leads) {
    const bucket =
      byStage[lead.status] ||
      (byStage[lead.status] = {
        count: 0,
        value: 0,
      });

    bucket.count += 1;
    bucket.value += lead.value || 0;

    totalValue += lead.value || 0;

    if (lead.status === "Won") {
      wonValue += lead.value || 0;
    }
  }

  const won = byStage.Won.count;
  const lost = byStage.Lost.count;

  const closed = won + lost;

  const conversionRate =
    closed > 0
      ? Math.round((won / closed) * 100)
      : 0;

  // ==========================
  // Monthly Trend
  // ==========================
  const months = lastSixMonths();

  const trend = months.map((m) => ({
    key: m.key,
    label: m.label,
    leads: 0,
    won: 0,
  }));

  const indexByKey = Object.fromEntries(
    trend.map((m) => [m.key, m])
  );

  for (const lead of leads) {
    const d = new Date(lead.createdAt);

    const key = `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}`;

    const row = indexByKey[key];

    if (!row) continue;

    row.leads += 1;

    if (lead.status === "Won") {
      row.won += 1;
    }
  }

  // ==========================
  // Response
  // ==========================
  res.json({
    success: true,
    overview: {
      totalLeads: leads.length,
      totalContacts: contactCount,
      openTasks,
      pipelineValue: totalValue,
      wonValue,
      conversionRate,
    },
    pipeline: byStage,
    trend,
  });
});

// ======================================
// Last 6 Months Helper
// ======================================
const lastSixMonths = () => {
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const out = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    out.push({
      key: `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}`,
      label: labels[d.getMonth()],
    });
  }

  return out;
};