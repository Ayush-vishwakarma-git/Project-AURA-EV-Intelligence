import { Router } from "express";

const router = Router();

function r(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function spark(base: number, len = 10, v = 0.05) {
  return Array.from({ length: len }, () => Math.round(base * (1 + (Math.random() - 0.5) * v) * 10) / 10);
}

router.get("/manufacturing/kpis", (_req, res) => {
  res.json({
    oee: { value: 87.3, unit: "%", trend: "up", changePercent: 1.8, sparkline: spark(86, 10, 0.03) },
    firstPassYield: { value: 94.7, unit: "%", trend: "up", changePercent: 0.6, sparkline: spark(94, 10, 0.02) },
    defectRate: { value: 1.42, unit: "%", trend: "down", changePercent: -8.4, sparkline: spark(1.55, 10, 0.1) },
    productionVolume: { value: 4280, unit: "units/day", trend: "up", changePercent: 3.1, sparkline: spark(4150, 10, 0.04) },
    throughput: { value: 312, unit: "units/hr", trend: "stable", changePercent: 0.2, sparkline: spark(311, 10, 0.02) },
    mtbf: { value: 187, unit: "hours", trend: "up", changePercent: 4.7, sparkline: spark(180, 10, 0.05) },
    mttr: { value: 2.4, unit: "hours", trend: "down", changePercent: -11.2, sparkline: spark(2.7, 10, 0.08) },
  });
});

router.get("/manufacturing/quality-drift", (req, res) => {
  const days = parseInt(req.query["days"] as string) || 30;
  const target = 1.5;
  const ucl = 2.1;
  const lcl = 0.9;
  const data = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - days + 1 + i);
    const defectRate = Math.max(0.4, Math.min(3.2, target + (Math.random() - 0.5) * 0.8 + (i > 20 ? 0.3 : 0)));
    return {
      date: d.toISOString().split("T")[0],
      defectRate: Math.round(defectRate * 100) / 100,
      target,
      upperLimit: ucl,
      lowerLimit: lcl,
    };
  });
  res.json(data);
});

router.get("/manufacturing/defects", (_req, res) => {
  res.json([
    { category: "Weld Defects", count: 387, percentage: 28.4, trend: "down", severity: "major" },
    { category: "Surface Contamination", count: 241, percentage: 17.7, trend: "stable", severity: "minor" },
    { category: "Dimensional Variance", count: 198, percentage: 14.5, trend: "up", severity: "major" },
    { category: "Electrical Faults", count: 167, percentage: 12.2, trend: "down", severity: "critical" },
    { category: "Assembly Gaps", count: 143, percentage: 10.5, trend: "stable", severity: "minor" },
    { category: "Coating Failures", count: 118, percentage: 8.7, trend: "up", severity: "major" },
    { category: "Thermal Issues", count: 89, percentage: 6.5, trend: "down", severity: "critical" },
    { category: "Other", count: 21, percentage: 1.5, trend: "stable", severity: "minor" },
  ]);
});

router.get("/manufacturing/inspections", (_req, res) => {
  const lines = ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5"];
  const shifts = ["morning", "afternoon", "night"] as const;
  const inspectors = ["K. Chen", "M. Rodriguez", "A. Patel", "J. Williams", "S. Kim", "R. Okonkwo"];
  const now = new Date();
  const results = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - Math.floor(i / 3));
    const units = Math.floor(r(180, 320));
    const defects = Math.floor(r(1, 12));
    return {
      id: `ir-${String(i + 1).padStart(3, "0")}`,
      date: d.toISOString().split("T")[0],
      line: lines[Math.floor(Math.random() * lines.length)],
      shift: shifts[Math.floor(Math.random() * shifts.length)],
      unitsInspected: units,
      defectsFound: defects,
      passRate: Math.round((1 - defects / units) * 1000) / 10,
      inspector: inspectors[Math.floor(Math.random() * inspectors.length)],
      anomalyDetected: Math.random() > 0.8,
    };
  });
  res.json(results);
});

router.get("/manufacturing/heatmap", (_req, res) => {
  const lines = ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5"];
  const shifts = ["Morning", "Afternoon", "Night"];
  const data = [];
  for (const line of lines) {
    for (const shift of shifts) {
      data.push({
        line,
        shift,
        defectRate: Math.round(r(0.5, 3.5) * 100) / 100,
      });
    }
  }
  res.json({ lines, shifts, data });
});

export default router;
