import { Router } from "express";

const router = Router();

const SUPPLIERS = [
  { id: "s1", name: "CATL", country: "China", category: "battery-cells", riskScore: 72, riskLevel: "high", minerals: ["lithium", "cobalt", "manganese"], concentration: 34.2, deliveryScore: 87, geopoliticalRisk: 68 },
  { id: "s2", name: "LG Energy Solution", country: "South Korea", category: "battery-cells", riskScore: 41, riskLevel: "medium", minerals: ["lithium", "nickel", "cobalt"], concentration: 18.7, deliveryScore: 94, geopoliticalRisk: 32 },
  { id: "s3", name: "Umicore", country: "Belgium", category: "raw-materials", riskScore: 28, riskLevel: "low", minerals: ["cobalt", "nickel", "manganese"], concentration: 12.1, deliveryScore: 96, geopoliticalRisk: 18 },
  { id: "s4", name: "Ganfeng Lithium", country: "China", category: "raw-materials", riskScore: 81, riskLevel: "critical", minerals: ["lithium"], concentration: 22.4, deliveryScore: 79, geopoliticalRisk: 75 },
  { id: "s5", name: "Glencore", country: "Switzerland", category: "raw-materials", riskScore: 54, riskLevel: "medium", minerals: ["cobalt", "nickel"], concentration: 8.9, deliveryScore: 91, geopoliticalRisk: 22 },
  { id: "s6", name: "Albemarle", country: "USA", category: "raw-materials", riskScore: 22, riskLevel: "low", minerals: ["lithium"], concentration: 9.3, deliveryScore: 97, geopoliticalRisk: 12 },
  { id: "s7", name: "Samsung SDI", country: "South Korea", category: "battery-cells", riskScore: 38, riskLevel: "medium", minerals: ["lithium", "cobalt", "nickel"], concentration: 15.4, deliveryScore: 93, geopoliticalRisk: 30 },
  { id: "s8", name: "Norilsk Nickel", country: "Russia", category: "raw-materials", riskScore: 94, riskLevel: "critical", minerals: ["nickel", "cobalt", "palladium"], concentration: 11.2, deliveryScore: 62, geopoliticalRisk: 92 },
  { id: "s9", name: "Panasonic", country: "Japan", category: "battery-cells", riskScore: 31, riskLevel: "low", minerals: ["lithium", "nickel"], concentration: 14.8, deliveryScore: 95, geopoliticalRisk: 20 },
  { id: "s10", name: "SQM", country: "Chile", category: "raw-materials", riskScore: 45, riskLevel: "medium", minerals: ["lithium"], concentration: 7.6, deliveryScore: 88, geopoliticalRisk: 38 },
  { id: "s11", name: "POSCO", country: "South Korea", category: "manufacturing", riskScore: 33, riskLevel: "low", minerals: ["nickel", "manganese"], concentration: 6.2, deliveryScore: 92, geopoliticalRisk: 25 },
  { id: "s12", name: "MP Materials", country: "USA", category: "raw-materials", riskScore: 19, riskLevel: "low", minerals: ["rare-earths"], concentration: 4.1, deliveryScore: 98, geopoliticalRisk: 10 },
  { id: "s13", name: "Freeport-McMoRan", country: "USA", category: "raw-materials", riskScore: 26, riskLevel: "low", minerals: ["copper", "molybdenum"], concentration: 5.8, deliveryScore: 94, geopoliticalRisk: 14 },
  { id: "s14", name: "Vale", country: "Brazil", category: "raw-materials", riskScore: 48, riskLevel: "medium", minerals: ["nickel", "cobalt"], concentration: 9.7, deliveryScore: 86, geopoliticalRisk: 41 },
  { id: "s15", name: "Stellantis", country: "Netherlands", category: "manufacturing", riskScore: 35, riskLevel: "medium", minerals: ["aluminum", "steel"], concentration: 7.3, deliveryScore: 90, geopoliticalRisk: 22 },
];

router.get("/supply-chain/suppliers", (_req, res) => {
  res.json(SUPPLIERS);
});

router.get("/supply-chain/risk-summary", (_req, res) => {
  res.json({
    overallRisk: 68.2,
    criticalSuppliers: 2,
    highRiskMinerals: 4,
    concentrationRisk: 73.4,
    geopoliticalRisk: 61.8,
    riskByCategory: [
      { category: "Battery Cells", risk: 50.3, suppliers: 4 },
      { category: "Raw Materials", risk: 75.4, suppliers: 8 },
      { category: "Manufacturing", risk: 34.1, suppliers: 2 },
      { category: "Electronics", risk: 28.7, suppliers: 3 },
      { category: "Logistics", risk: 22.4, suppliers: 2 },
    ],
  });
});

router.get("/supply-chain/mineral-risks", (_req, res) => {
  res.json([
    { mineral: "Cobalt", riskScore: 82, riskLevel: "critical", primaryCountry: "DRC", alternatives: 2, criticalityScore: 91, priceTrend: genPriceTrend(28000, 12) },
    { mineral: "Lithium", riskScore: 68, riskLevel: "high", primaryCountry: "China", alternatives: 4, criticalityScore: 95, priceTrend: genPriceTrend(42000, 12) },
    { mineral: "Nickel", riskScore: 74, riskLevel: "high", primaryCountry: "Russia", alternatives: 3, criticalityScore: 82, priceTrend: genPriceTrend(18500, 12) },
    { mineral: "Manganese", riskScore: 41, riskLevel: "medium", primaryCountry: "South Africa", alternatives: 5, criticalityScore: 64, priceTrend: genPriceTrend(3200, 12) },
    { mineral: "Rare Earths", riskScore: 87, riskLevel: "critical", primaryCountry: "China", alternatives: 1, criticalityScore: 78, priceTrend: genPriceTrend(156000, 12) },
    { mineral: "Copper", riskScore: 32, riskLevel: "low", primaryCountry: "Chile", alternatives: 8, criticalityScore: 71, priceTrend: genPriceTrend(8900, 12) },
    { mineral: "Graphite", riskScore: 61, riskLevel: "medium", primaryCountry: "China", alternatives: 2, criticalityScore: 68, priceTrend: genPriceTrend(1200, 12) },
    { mineral: "Palladium", riskScore: 78, riskLevel: "high", primaryCountry: "Russia", alternatives: 2, criticalityScore: 55, priceTrend: genPriceTrend(1480, 12) },
  ]);
});

function genPriceTrend(base: number, months: number) {
  return Array.from({ length: months }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - months + 1 + i);
    return { date: d.toLocaleString("default", { month: "short", year: "2-digit" }), value: Math.round(base * (0.85 + Math.random() * 0.3)) };
  });
}

router.get("/supply-chain/country-risks", (_req, res) => {
  res.json([
    { country: "China", countryCode: "CN", riskScore: 78, politicalStability: 55, tradeRelations: 42, supplierCount: 6 },
    { country: "Russia", countryCode: "RU", riskScore: 93, politicalStability: 22, tradeRelations: 15, supplierCount: 2 },
    { country: "DRC", countryCode: "CD", riskScore: 87, politicalStability: 18, tradeRelations: 45, supplierCount: 1 },
    { country: "South Korea", countryCode: "KR", riskScore: 28, politicalStability: 88, tradeRelations: 91, supplierCount: 4 },
    { country: "USA", countryCode: "US", riskScore: 14, politicalStability: 94, tradeRelations: 98, supplierCount: 4 },
    { country: "Japan", countryCode: "JP", riskScore: 21, politicalStability: 96, tradeRelations: 89, supplierCount: 2 },
    { country: "Belgium", countryCode: "BE", riskScore: 18, politicalStability: 97, tradeRelations: 95, supplierCount: 1 },
    { country: "Chile", countryCode: "CL", riskScore: 42, politicalStability: 72, tradeRelations: 78, supplierCount: 2 },
    { country: "Brazil", countryCode: "BR", riskScore: 48, politicalStability: 64, tradeRelations: 71, supplierCount: 1 },
    { country: "South Africa", countryCode: "ZA", riskScore: 45, politicalStability: 61, tradeRelations: 74, supplierCount: 1 },
  ]);
});

router.get("/supply-chain/geopolitical-alerts", (_req, res) => {
  const now = Date.now();
  res.json([
    { id: "ga1", title: "DRC Cobalt Export Restrictions", country: "DRC", severity: "critical", description: "New government decree may restrict cobalt exports by up to 40% — impacts 3 Tier 1 battery suppliers", timestamp: new Date(now - 2 * 3600000).toISOString(), impactedMinerals: ["cobalt"] },
    { id: "ga2", title: "Russia-EU Nickel Trade Sanctions", country: "Russia", severity: "critical", description: "Expanded EU sanctions targeting Norilsk Nickel subsidiaries — alternative sourcing required immediately", timestamp: new Date(now - 6 * 3600000).toISOString(), impactedMinerals: ["nickel", "palladium", "cobalt"] },
    { id: "ga3", title: "China Lithium Processing Controls", country: "China", severity: "warning", description: "China announces new export licensing for processed lithium compounds — 8-12 week lead time increase expected", timestamp: new Date(now - 24 * 3600000).toISOString(), impactedMinerals: ["lithium", "rare-earths"] },
    { id: "ga4", title: "Chile Political Instability", country: "Chile", severity: "warning", description: "Mining sector strikes affecting Atacama region lithium brine operations — 2 of 4 facilities partially halted", timestamp: new Date(now - 48 * 3600000).toISOString(), impactedMinerals: ["lithium"] },
    { id: "ga5", title: "South Africa Power Outages", country: "South Africa", severity: "warning", description: "Load shedding schedule disrupting manganese processing plant operations — 15% output reduction", timestamp: new Date(now - 72 * 3600000).toISOString(), impactedMinerals: ["manganese"] },
  ]);
});

router.get("/supply-chain/network", (_req, res) => {
  res.json({
    nodes: [
      { id: "n-manufacturer", label: "AURA Manufacturing", type: "manufacturer", riskScore: 25, country: "USA", position: { x: 500, y: 400 } },
      { id: "n-catl", label: "CATL", type: "tier1", riskScore: 72, country: "China", position: { x: 250, y: 200 } },
      { id: "n-lge", label: "LG Energy", type: "tier1", riskScore: 41, country: "South Korea", position: { x: 500, y: 200 } },
      { id: "n-panasonic", label: "Panasonic", type: "tier1", riskScore: 31, country: "Japan", position: { x: 750, y: 200 } },
      { id: "n-ganfeng", label: "Ganfeng Lithium", type: "tier2", riskScore: 81, country: "China", position: { x: 100, y: 50 } },
      { id: "n-norilsk", label: "Norilsk Nickel", type: "tier2", riskScore: 94, country: "Russia", position: { x: 300, y: 50 } },
      { id: "n-glencore", label: "Glencore", type: "tier2", riskScore: 54, country: "Switzerland", position: { x: 500, y: 50 } },
      { id: "n-albemarle", label: "Albemarle", type: "raw-material", riskScore: 22, country: "USA", position: { x: 700, y: 50 } },
      { id: "n-mp", label: "MP Materials", type: "raw-material", riskScore: 19, country: "USA", position: { x: 900, y: 50 } },
      { id: "n-logistics", label: "AURA Logistics", type: "logistics", riskScore: 28, country: "USA", position: { x: 500, y: 550 } },
    ],
    edges: [
      { id: "e1", source: "n-catl", target: "n-manufacturer", flow: 34.2, label: "Battery Cells", animated: true },
      { id: "e2", source: "n-lge", target: "n-manufacturer", flow: 18.7, label: "Battery Cells", animated: true },
      { id: "e3", source: "n-panasonic", target: "n-manufacturer", flow: 14.8, label: "Battery Cells", animated: true },
      { id: "e4", source: "n-ganfeng", target: "n-catl", flow: 22.4, label: "Lithium", animated: true },
      { id: "e5", source: "n-norilsk", target: "n-catl", flow: 11.2, label: "Nickel/Cobalt", animated: true },
      { id: "e6", source: "n-glencore", target: "n-lge", flow: 8.9, label: "Cobalt", animated: true },
      { id: "e7", source: "n-albemarle", target: "n-lge", flow: 9.3, label: "Lithium", animated: true },
      { id: "e8", source: "n-mp", target: "n-panasonic", flow: 4.1, label: "Rare Earths", animated: true },
      { id: "e9", source: "n-manufacturer", target: "n-logistics", flow: 100, label: "Finished Units", animated: true },
    ],
  });
});

router.get("/geo/supplier-locations", (_req, res) => {
  res.json(SUPPLIERS.map(s => ({
    id: s.id,
    name: s.name,
    country: s.country,
    lat: { "China": 35.86, "South Korea": 37.57, "Belgium": 50.85, "Switzerland": 46.82, "USA": 37.09, "Japan": 36.2, "Russia": 61.52, "Chile": -35.68, "Brazil": -14.24, "Netherlands": 52.37 }[s.country] ?? 20,
    lng: { "China": 104.19, "South Korea": 127.97, "Belgium": 4.35, "Switzerland": 8.23, "USA": -95.71, "Japan": 138.25, "Russia": 105.32, "Chile": -71.54, "Brazil": -51.93, "Netherlands": 4.90 }[s.country] ?? 0,
    riskLevel: s.riskLevel,
    minerals: s.minerals,
  })));
});

export default router;
