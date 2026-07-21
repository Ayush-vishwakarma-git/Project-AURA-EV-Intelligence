import { Router } from "express";

const router = Router();

const MAKES = ["CATL", "BYD", "Panasonic", "LG Energy", "Samsung SDI", "SK Innovation", "SVOLT", "Northvolt"];
const STATUSES = ["healthy", "healthy", "healthy", "healthy", "warning", "warning", "critical"] as const;
const LOCATIONS = ["Oakland Hub", "Chicago Depot", "Dallas Fleet", "Atlanta Base", "Seattle Terminal", "Phoenix Yard", "Denver Center", "Miami Port"];

function randBetween(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function generateBatteryAssets(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const id = String(i + 1).padStart(4, "0");
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const soh = status === "critical" ? randBetween(60, 74) : status === "warning" ? randBetween(75, 84) : randBetween(85, 99);
    const rul = status === "critical" ? randBetween(30, 120) : status === "warning" ? randBetween(121, 280) : randBetween(281, 730);
    const nominalCapacity = [75, 82, 100, 135, 150][Math.floor(Math.random() * 5)];
    return {
      id: `bat-${id}`,
      batteryId: `BAT-${id}`,
      vehicleId: `VH-${id}`,
      soh,
      rul,
      status,
      temperature: randBetween(22, 45),
      cycles: Math.floor(Math.random() * 1800) + 100,
      capacity: Math.round(nominalCapacity * (soh / 100) * 10) / 10,
      nominalCapacity,
      lastUpdated: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      predictedFailureDate: status === "critical" ? new Date(Date.now() + rul * 86400000).toISOString() : null,
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    };
  });
}

const ALL_ASSETS = generateBatteryAssets(1547);

router.get("/battery/assets", (req, res) => {
  const status = req.query["status"] as string || "all";
  const page = parseInt(req.query["page"] as string) || 1;
  const limit = parseInt(req.query["limit"] as string) || 50;

  let filtered = ALL_ASSETS;
  if (status && status !== "all") {
    filtered = ALL_ASSETS.filter(a => a.status === status);
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  res.json({ data, total, page, limit });
});

router.get("/battery/assets/:assetId", (req, res) => {
  const asset = ALL_ASSETS.find(a => a.id === req.params["assetId"] || a.batteryId === req.params["assetId"]);
  if (!asset) {
    res.status(404).json({ error: "Asset not found" });
    return;
  }
  const history = Array.from({ length: 24 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - 23 + i);
    return {
      date: date.toISOString().split("T")[0],
      soh: Math.max(60, asset.soh - (23 - i) * 0.3 + randBetween(-0.5, 0.5)),
      temperature: randBetween(24, 38),
      cycles: asset.cycles - (23 - i) * 6,
    };
  });
  const maintenanceHistory = [
    { date: "2024-08-15", type: "Battery Inspection", description: "Full BMS diagnostic and cell balancing", technician: "J. Rodriguez" },
    { date: "2024-03-22", type: "Cooling System Service", description: "Thermal management system flush and refill", technician: "M. Chen" },
    { date: "2023-11-10", type: "Cell Replacement", description: "3 degraded cells replaced in module B", technician: "A. Patel" },
  ];
  res.json({ ...asset, history, maintenanceHistory, aiRiskNarrative: asset.status === "critical" ? "This battery exhibits accelerated capacity fade consistent with lithium plating from repeated fast-charging events. Immediate capacity rebalancing recommended before next operational cycle." : null });
});

router.get("/battery/health-summary", (_req, res) => {
  const buckets = [
    { range: "95-100%", count: 287, percentage: 18.5 },
    { range: "90-95%", count: 423, percentage: 27.3 },
    { range: "85-90%", count: 398, percentage: 25.7 },
    { range: "80-85%", count: 241, percentage: 15.6 },
    { range: "75-80%", count: 134, percentage: 8.7 },
    { range: "70-75%", count: 48, percentage: 3.1 },
    { range: "<70%", count: 16, percentage: 1.0 },
  ];
  res.json({
    sohDistribution: buckets,
    totalAssets: 1547,
    healthyCount: 1108,
    warningCount: 375,
    criticalCount: 64,
    avgSoh: 87.4,
    avgRul: 412,
    estimatedSavings: 2340000,
  });
});

router.get("/battery/degradation-trend", (req, res) => {
  const months = parseInt(req.query["months"] as string) || 12;
  const data = Array.from({ length: months + 6 }, (_, i) => {
    const isPredicted = i >= months;
    const d = new Date();
    d.setMonth(d.getMonth() - months + i);
    const base = 92 - i * 0.38;
    return {
      month: d.toLocaleString("default", { month: "short", year: "2-digit" }),
      avgSoh: Math.round((base + randBetween(-0.3, 0.3)) * 10) / 10,
      p10Soh: Math.round((base - 6 + randBetween(-0.2, 0.2)) * 10) / 10,
      p90Soh: Math.round((base + 4 + randBetween(-0.2, 0.2)) * 10) / 10,
      predicted: isPredicted,
    };
  });
  res.json(data);
});

router.get("/battery/alerts", (_req, res) => {
  const now = Date.now();
  res.json([
    { id: "ba1", batteryId: "BAT-0042", vehicleId: "VH-0042", type: "degradation", severity: "critical", message: "SOH below 70% — immediate inspection required", timestamp: new Date(now - 15 * 60000).toISOString(), acknowledged: false },
    { id: "ba2", batteryId: "BAT-0189", vehicleId: "VH-0189", type: "temperature", severity: "critical", message: "Cell temperature 62°C exceeds safe operating limit", timestamp: new Date(now - 32 * 60000).toISOString(), acknowledged: false },
    { id: "ba3", batteryId: "BAT-0311", vehicleId: "VH-0311", type: "rul", severity: "critical", message: "RUL estimated at 18 days — replacement imminent", timestamp: new Date(now - 48 * 60000).toISOString(), acknowledged: false },
    { id: "ba4", batteryId: "BAT-0574", vehicleId: "VH-0574", type: "voltage", severity: "warning", message: "Cell voltage imbalance detected — balancing recommended", timestamp: new Date(now - 2 * 3600000).toISOString(), acknowledged: false },
    { id: "ba5", batteryId: "BAT-0812", vehicleId: "VH-0812", type: "capacity", severity: "warning", message: "Capacity fade rate accelerating vs. 30-day baseline", timestamp: new Date(now - 4 * 3600000).toISOString(), acknowledged: true },
    { id: "ba6", batteryId: "BAT-0924", vehicleId: "VH-0924", type: "temperature", severity: "warning", message: "Thermal management system efficiency degraded by 12%", timestamp: new Date(now - 6 * 3600000).toISOString(), acknowledged: false },
    { id: "ba7", batteryId: "BAT-1103", vehicleId: "VH-1103", type: "degradation", severity: "warning", message: "SOH declined 2.1% in 30 days — above expected rate", timestamp: new Date(now - 8 * 3600000).toISOString(), acknowledged: false },
    { id: "ba8", batteryId: "BAT-1287", vehicleId: "VH-1287", type: "rul", severity: "warning", message: "Predicted RUL revised down 45 days based on recent cycles", timestamp: new Date(now - 12 * 3600000).toISOString(), acknowledged: true },
  ]);
});

router.get("/battery/maintenance-schedule", (_req, res) => {
  const today = new Date();
  const items = [
    { id: "m1", batteryId: "BAT-0042", vehicleId: "VH-0042", scheduledDate: addDays(today, 2).toISOString().split("T")[0], type: "Emergency Inspection", priority: "high", estimatedDowntime: 8, estimatedCost: 4200 },
    { id: "m2", batteryId: "BAT-0189", vehicleId: "VH-0189", scheduledDate: addDays(today, 3).toISOString().split("T")[0], type: "Thermal System Service", priority: "high", estimatedDowntime: 6, estimatedCost: 2800 },
    { id: "m3", batteryId: "BAT-0311", vehicleId: "VH-0311", scheduledDate: addDays(today, 5).toISOString().split("T")[0], type: "Battery Replacement", priority: "high", estimatedDowntime: 24, estimatedCost: 18500 },
    { id: "m4", batteryId: "BAT-0574", vehicleId: "VH-0574", scheduledDate: addDays(today, 7).toISOString().split("T")[0], type: "Cell Balancing", priority: "medium", estimatedDowntime: 4, estimatedCost: 850 },
    { id: "m5", batteryId: "BAT-0624", vehicleId: "VH-0624", scheduledDate: addDays(today, 10).toISOString().split("T")[0], type: "BMS Firmware Update", priority: "medium", estimatedDowntime: 2, estimatedCost: 300 },
    { id: "m6", batteryId: "BAT-0812", vehicleId: "VH-0812", scheduledDate: addDays(today, 12).toISOString().split("T")[0], type: "Capacity Test", priority: "medium", estimatedDowntime: 5, estimatedCost: 1200 },
    { id: "m7", batteryId: "BAT-0924", vehicleId: "VH-0924", scheduledDate: addDays(today, 14).toISOString().split("T")[0], type: "Cooling System Flush", priority: "low", estimatedDowntime: 3, estimatedCost: 650 },
    { id: "m8", batteryId: "BAT-1103", vehicleId: "VH-1103", scheduledDate: addDays(today, 18).toISOString().split("T")[0], type: "Routine Inspection", priority: "low", estimatedDowntime: 4, estimatedCost: 750 },
  ];
  res.json(items);
});

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default router;
