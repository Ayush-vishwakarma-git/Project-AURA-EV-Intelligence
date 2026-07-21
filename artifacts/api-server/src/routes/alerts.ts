import { Router } from "express";

const router = Router();

const alertsDb: Record<string, {
  id: string; title: string; domain: string; severity: string;
  message: string; timestamp: string; acknowledged: boolean;
  assetId: string | null; actionUrl: string | null;
}> = {
  "al-001": { id: "al-001", title: "Critical Battery Degradation", domain: "battery", severity: "critical", message: "BAT-0042 SOH at 67.3% — below critical threshold. Immediate inspection required.", timestamp: new Date(Date.now() - 15 * 60000).toISOString(), acknowledged: false, assetId: "BAT-0042", actionUrl: "/battery" },
  "al-002": { id: "al-002", title: "Thermal Runaway Risk", domain: "battery", severity: "critical", message: "BAT-0189 cell temperature 62°C — exceeds safe limit. Cooling system fault detected.", timestamp: new Date(Date.now() - 32 * 60000).toISOString(), acknowledged: false, assetId: "BAT-0189", actionUrl: "/battery" },
  "al-003": { id: "al-003", title: "DRC Cobalt Export Restriction", domain: "supply-chain", severity: "critical", message: "Government decree restricts cobalt exports by up to 40%. 3 Tier 1 suppliers affected.", timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), acknowledged: false, assetId: null, actionUrl: "/supply-chain" },
  "al-004": { id: "al-004", title: "Manufacturing Quality Drift", domain: "manufacturing", severity: "warning", message: "Line 3 defect rate at 3.4% — exceeds UCL of 2.1% for 8 consecutive shifts.", timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), acknowledged: false, assetId: "LINE-3", actionUrl: "/manufacturing" },
  "al-005": { id: "al-005", title: "RUL Below 30 Days", domain: "battery", severity: "critical", message: "BAT-0311 predicted RUL: 18 days. Replacement scheduling required immediately.", timestamp: new Date(Date.now() - 48 * 60000).toISOString(), acknowledged: false, assetId: "BAT-0311", actionUrl: "/battery" },
  "al-006": { id: "al-006", title: "Supply Chain Concentration Risk", domain: "supply-chain", severity: "warning", message: "Norilsk Nickel sanctions exposure elevated to HIGH. 47% nickel supply at risk.", timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), acknowledged: false, assetId: null, actionUrl: "/supply-chain" },
  "al-007": { id: "al-007", title: "Fleet Readiness Score Drop", domain: "fleet", severity: "warning", message: "Dallas Fleet depot readiness dropped 4.2% — charging station utilization at 94%.", timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), acknowledged: true, assetId: null, actionUrl: "/fleet" },
  "al-008": { id: "al-008", title: "Scope 1 Emissions Spike", domain: "carbon", severity: "warning", message: "Phoenix Yard Scope 1 emissions up 12.4% — generator fuel usage above baseline.", timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), acknowledged: false, assetId: null, actionUrl: "/carbon" },
  "al-009": { id: "al-009", title: "Maintenance Backlog Growing", domain: "battery", severity: "warning", message: "14 scheduled maintenance tasks overdue. Fleet availability risk increasing.", timestamp: new Date(Date.now() - 16 * 3600000).toISOString(), acknowledged: false, assetId: null, actionUrl: "/battery" },
  "al-010": { id: "al-010", title: "Voltage Imbalance Detected", domain: "battery", severity: "warning", message: "BAT-0574 cell voltage spread 48mV — balancing recommended within 48 hours.", timestamp: new Date(Date.now() - 20 * 3600000).toISOString(), acknowledged: true, assetId: "BAT-0574", actionUrl: "/battery" },
  "al-011": { id: "al-011", title: "API Server Latency Spike", domain: "system", severity: "info", message: "Battery analytics endpoint P99 latency at 2,340ms — investigating.", timestamp: new Date(Date.now() - 25 * 3600000).toISOString(), acknowledged: true, assetId: null, actionUrl: null },
  "al-012": { id: "al-012", title: "AI Model Retrained", domain: "system", severity: "info", message: "Battery RUL prediction model retrained on 2.1M new data points. Accuracy improved 3.2%.", timestamp: new Date(Date.now() - 30 * 3600000).toISOString(), acknowledged: true, assetId: null, actionUrl: null },
};

router.get("/alerts", (req, res) => {
  const severity = req.query["severity"] as string;
  const limit = parseInt(req.query["limit"] as string) || 20;

  let result = Object.values(alertsDb);
  if (severity && severity !== "all") {
    result = result.filter(a => a.severity === severity);
  }
  result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  res.json(result.slice(0, limit));
});

router.post("/alerts/:alertId/acknowledge", (req, res) => {
  const alert = alertsDb[req.params["alertId"]];
  if (!alert) { res.status(404).json({ error: "Not found" }); return; }
  alert.acknowledged = true;
  res.json(alert);
});

export default router;
