import { Router } from "express";

const router = Router();

const EV_MAKES = ["Tesla", "Rivian", "BYD", "Proterra", "Lion Electric", "Nikola", "Bollinger", "Xos Trucks"];
const ICE_MAKES = ["Ford", "Chevrolet", "Ram", "Mercedes-Benz", "Volvo", "Kenworth", "Peterbilt", "Freightliner"];
const VEHICLE_TYPES = ["BEV", "BEV", "BEV", "PHEV", "HEV", "ICE", "ICE"] as const;
const STATUSES = ["active", "active", "active", "active", "charging", "idle", "maintenance", "offline"] as const;
const LOCATIONS = ["Oakland Hub", "Chicago Depot", "Dallas Fleet", "Atlanta Base", "Seattle Terminal", "Phoenix Yard", "Denver Center", "Miami Port"];

function randBetween(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function generateFleetVehicles(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const id = String(i + 1).padStart(4, "0");
    const type = VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)];
    const isEV = type === "BEV" || type === "PHEV";
    const make = isEV ? EV_MAKES[Math.floor(Math.random() * EV_MAKES.length)] : ICE_MAKES[Math.floor(Math.random() * ICE_MAKES.length)];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const year = 2018 + Math.floor(Math.random() * 7);
    return {
      id: `vh-${id}`,
      vehicleId: `VH-${id}`,
      make,
      model: isEV ? ["Model Y", "R1T", "Han EV", "Catalyst", "Urban Lion", "Tre BEV"][Math.floor(Math.random() * 6)] : ["F-250", "Silverado", "ProMaster", "Sprinter", "FH 500"][Math.floor(Math.random() * 5)],
      year,
      type,
      status,
      batterySOH: isEV ? randBetween(72, 99) : null,
      mileage: Math.floor(Math.random() * 180000) + 5000,
      lastService: new Date(Date.now() - Math.random() * 180 * 86400000).toISOString().split("T")[0],
      driver: Math.random() > 0.2 ? `Driver ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}. ${["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"][Math.floor(Math.random() * 8)]}` : null,
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
      electrificationScore: isEV ? null : randBetween(45, 95),
    };
  });
}

const ALL_VEHICLES = generateFleetVehicles(1547);

router.get("/fleet/vehicles", (req, res) => {
  const status = req.query["status"] as string;
  const page = parseInt(req.query["page"] as string) || 1;
  const limit = parseInt(req.query["limit"] as string) || 50;

  let filtered = ALL_VEHICLES;
  if (status && status !== "all") {
    filtered = ALL_VEHICLES.filter(v => v.status === status);
  }

  const total = filtered.length;
  const data = filtered.slice((page - 1) * limit, page * limit);
  res.json({ data, total, page, limit });
});

router.get("/fleet/readiness", (_req, res) => {
  const trend = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - 11 + i);
    return { date: d.toLocaleString("default", { month: "short" }), value: randBetween(62, 76) };
  });
  trend[trend.length - 1] = { date: trend[trend.length - 1].date, value: 74.8 };

  res.json({
    overallScore: 74.8,
    evCount: 687,
    iceCount: 523,
    hybridCount: 337,
    readinessByCategory: [
      { category: "Route Compatibility", score: 82, maxScore: 100 },
      { category: "Charging Infrastructure", score: 71, maxScore: 100 },
      { category: "Driver Readiness", score: 78, maxScore: 100 },
      { category: "Maintenance Capability", score: 68, maxScore: 100 },
      { category: "Financial Readiness", score: 76, maxScore: 100 },
    ],
    scoreTrend: trend,
  });
});

router.get("/fleet/ev-recommendations", (_req, res) => {
  res.json([
    { id: "ev1", make: "Tesla", model: "Semi", type: "Class 8 BEV", range: 500, chargingSpeed: 1000, tco5Year: 385000, score: 94, reasons: ["Lowest TCO in class", "Supercharger network coverage", "OTA update capability", "Zero emissions compliance"] },
    { id: "ev2", make: "Rivian", model: "EDV 700", type: "Delivery Van BEV", range: 170, chargingSpeed: 50, tco5Year: 142000, score: 89, reasons: ["Purpose-built for last-mile delivery", "Fleet management software included", "High reliability scores", "Strong resale value"] },
    { id: "ev3", make: "Proterra", model: "Catalyst E2 Max", type: "Transit Bus BEV", range: 350, chargingSpeed: 450, tco5Year: 620000, score: 87, reasons: ["Highest range in transit class", "Opportunity charging compatible", "Low maintenance costs", "Government rebate eligible"] },
    { id: "ev4", make: "BYD", model: "6F", type: "Forklift BEV", range: 420, chargingSpeed: 80, tco5Year: 95000, score: 85, reasons: ["Iron-phosphate chemistry longevity", "Competitive acquisition cost", "Proven industrial reliability", "Global service network"] },
    { id: "ev5", make: "Xos Trucks", model: "Medium Duty", type: "Class 5-6 BEV", range: 200, chargingSpeed: 120, tco5Year: 185000, score: 82, reasons: ["Fleet-as-a-service available", "App-based fleet management", "Modular battery system", "Urban route optimized"] },
  ]);
});

router.get("/fleet/charging-analysis", (_req, res) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  res.json({
    totalStations: 87,
    utilizationRate: 68.4,
    avgChargingTime: 2.8,
    peakHours: [7, 8, 17, 18, 19],
    chargingByDay: days.map(day => ({
      day,
      sessions: Math.floor(randBetween(120, 280)),
      energy: Math.round(randBetween(4200, 9800)),
      peakLoad: Math.round(randBetween(280, 520)),
    })),
    demandForecast: Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() + i);
      return { date: d.toLocaleString("default", { month: "short", year: "2-digit" }), value: Math.round(9800 + i * 820) };
    }),
  });
});

router.get("/fleet/financial-savings", (_req, res) => {
  res.json({
    totalSavings: 4720000,
    fuelSavings: 2180000,
    maintenanceSavings: 1340000,
    incentives: 1200000,
    savingsBreakdown: [
      { category: "ICE Fleet Fuel", value: -3240000, change: -100 },
      { category: "EV Electricity", value: 1060000, change: 100 },
      { category: "Fuel Savings", value: 2180000, change: 67.3 },
      { category: "Maintenance Reduction", value: 1340000, change: 41.4 },
      { category: "Tax Incentives", value: 820000, change: 25.3 },
      { category: "Reg. Credits", value: 380000, change: 11.7 },
      { category: "Net Savings", value: 4720000, change: 145.7 },
    ],
    projections: Array.from({ length: 5 }, (_, i) => ({
      date: String(new Date().getFullYear() + i),
      value: Math.round(4720000 * Math.pow(1.18, i)),
    })),
  });
});

router.get("/fleet/transition-timeline", (_req, res) => {
  res.json([
    { id: "t1", title: "Phase 1: Light Duty Transition", targetDate: "2024-12-31", status: "completed", vehicleCount: 214, description: "Replace all light-duty vehicles under 50k miles with BEV equivalents" },
    { id: "t2", title: "Phase 2: Delivery Vans", targetDate: "2025-06-30", status: "in-progress", vehicleCount: 187, description: "Electrify last-mile delivery van fleet across all regional hubs" },
    { id: "t3", title: "Phase 3: Medium Duty", targetDate: "2025-12-31", status: "planned", vehicleCount: 145, description: "Replace Class 4-6 medium duty trucks with BEV alternatives" },
    { id: "t4", title: "Phase 4: Heavy Duty Trucks", targetDate: "2026-12-31", status: "planned", vehicleCount: 98, description: "Transition long-haul heavy duty fleet to BEV/FCEV technology" },
    { id: "t5", title: "Phase 5: Specialized Equipment", targetDate: "2027-06-30", status: "planned", vehicleCount: 64, description: "Electrify specialized industrial and off-road equipment" },
    { id: "t6", title: "100% Zero-Emission Fleet", targetDate: "2028-01-01", status: "planned", vehicleCount: 708, description: "Complete fleet electrification milestone — zero ICE vehicles in operation" },
  ]);
});

router.get("/geo/fleet-locations", (_req, res) => {
  const markers = ALL_VEHICLES.slice(0, 200).map(v => ({
    id: v.id,
    vehicleId: v.vehicleId,
    lat: 37.7749 + (Math.random() - 0.5) * 20,
    lng: -95.7129 + (Math.random() - 0.5) * 50,
    status: v.status as string,
    batteryLevel: v.batterySOH ?? Math.floor(Math.random() * 80) + 20,
    driver: v.driver,
  }));
  res.json(markers);
});

router.get("/geo/charging-stations", (_req, res) => {
  const stations = Array.from({ length: 87 }, (_, i) => ({
    id: `cs-${String(i + 1).padStart(3, "0")}`,
    name: `AURA Charging Hub ${String(i + 1).padStart(3, "0")}`,
    lat: 37.7749 + (Math.random() - 0.5) * 22,
    lng: -95.7129 + (Math.random() - 0.5) * 55,
    totalPorts: [4, 8, 12, 16, 24][Math.floor(Math.random() * 5)],
    availablePorts: Math.floor(Math.random() * 8),
    maxKw: [50, 150, 350, 500][Math.floor(Math.random() * 4)],
    status: Math.random() > 0.1 ? (Math.random() > 0.1 ? "operational" : "degraded") : "offline",
    operator: ["AURA Fleet", "ChargePoint", "EVgo", "Electrify America"][Math.floor(Math.random() * 4)],
  }));
  res.json(stations);
});

export default router;
