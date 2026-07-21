import { Router } from "express";

const router = Router();

function sparkline(base: number, len = 12, variance = 0.05): number[] {
  const arr: number[] = [];
  let v = base;
  for (let i = 0; i < len; i++) {
    v = v * (1 + (Math.random() - 0.5) * variance);
    arr.push(Math.round(v * 10) / 10);
  }
  return arr;
}

router.get("/dashboard/kpis", (_req, res) => {
  res.json({
    fleetSize: {
      value: 1547,
      unit: "vehicles",
      trend: "up",
      changePercent: 3.2,
      sparkline: sparkline(1500, 12, 0.02),
    },
    criticalAlerts: {
      value: 23,
      unit: "alerts",
      trend: "down",
      changePercent: -12.4,
      sparkline: sparkline(30, 12, 0.15),
    },
    avgBatterySoh: {
      value: 87.4,
      unit: "%",
      trend: "down",
      changePercent: -0.8,
      sparkline: sparkline(88, 12, 0.02),
    },
    avgRul: {
      value: 412,
      unit: "days",
      trend: "stable",
      changePercent: 0.3,
      sparkline: sparkline(410, 12, 0.03),
    },
    supplyChainRiskScore: {
      value: 68.2,
      unit: "/100",
      trend: "up",
      changePercent: 5.1,
      sparkline: sparkline(65, 12, 0.04),
    },
    fleetReadinessScore: {
      value: 74.8,
      unit: "%",
      trend: "up",
      changePercent: 2.6,
      sparkline: sparkline(72, 12, 0.03),
    },
    totalCostSavings: {
      value: 4720000,
      unit: "USD",
      trend: "up",
      changePercent: 18.3,
      sparkline: sparkline(4000000, 12, 0.04),
    },
    carbonReduction: {
      value: 32.6,
      unit: "%",
      trend: "up",
      changePercent: 4.2,
      sparkline: sparkline(30, 12, 0.03),
    },
  });
});

router.get("/dashboard/activity", (_req, res) => {
  const now = Date.now();
  res.json([
    { id: "a1", timestamp: new Date(now - 2 * 60000).toISOString(), type: "battery", message: "Battery BAT-0042 SOH dropped below 75% threshold", severity: "critical", assetId: "BAT-0042" },
    { id: "a2", timestamp: new Date(now - 8 * 60000).toISOString(), type: "ai", message: "AI detected cobalt supply chain disruption — 3 suppliers affected", severity: "warning", assetId: null },
    { id: "a3", timestamp: new Date(now - 15 * 60000).toISOString(), type: "fleet", message: "Fleet readiness score improved to 74.8% (+2.6%)", severity: "info", assetId: null },
    { id: "a4", timestamp: new Date(now - 31 * 60000).toISOString(), type: "manufacturing", message: "Line 3 defect rate exceeded UCL — quality drift detected", severity: "warning", assetId: "LINE-3" },
    { id: "a5", timestamp: new Date(now - 45 * 60000).toISOString(), type: "carbon", message: "Scope 2 emissions reduced by 8.3% vs. prior month", severity: "info", assetId: null },
    { id: "a6", timestamp: new Date(now - 62 * 60000).toISOString(), type: "supply-chain", message: "Geopolitical alert: DRC export restrictions may affect lithium supply", severity: "critical", assetId: null },
    { id: "a7", timestamp: new Date(now - 90 * 60000).toISOString(), type: "battery", message: "Predictive maintenance scheduled for 14 assets this week", severity: "info", assetId: null },
    { id: "a8", timestamp: new Date(now - 120 * 60000).toISOString(), type: "fleet", message: "25 ICE vehicles flagged for EV transition analysis", severity: "info", assetId: null },
    { id: "a9", timestamp: new Date(now - 180 * 60000).toISOString(), type: "ai", message: "AI Command Center generated 8 new high-priority recommendations", severity: "warning", assetId: null },
    { id: "a10", timestamp: new Date(now - 240 * 60000).toISOString(), type: "manufacturing", message: "OEE reached 91.2% on Line 1 — record high for Q3", severity: "info", assetId: "LINE-1" },
  ]);
});

export default router;
