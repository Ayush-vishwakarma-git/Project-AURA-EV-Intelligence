import { Router } from "express";

const router = Router();

const insights: Record<string, {
  id: string; title: string; domain: string; priority: string; confidenceScore: number;
  businessImpact: string; recommendedAction: string; estimatedSavings: number;
  affectedAssets: string[]; status: string; createdAt: string;
  rootCause: string | null; riskIfIgnored: string | null;
}> = {
  "ai-001": {
    id: "ai-001",
    title: "Cobalt Supply Chain Disruption — 72-Hour Action Window",
    domain: "supply-chain",
    priority: "critical",
    confidenceScore: 94,
    businessImpact: "DRC export restrictions will affect 34% of battery cell production capacity within 3 months if not addressed.",
    recommendedAction: "Activate secondary cobalt suppliers (Glencore, Umicore) and increase spot market procurement by 40% for Q1 buffer stock.",
    estimatedSavings: 8400000,
    affectedAssets: ["BAT-0001 to BAT-0547", "CATL Supply Contract", "LG Energy Supply Agreement"],
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    rootCause: "Geopolitical instability in DRC combined with 22% reduction in Glencore spot availability detected across 3 data sources.",
    riskIfIgnored: "Production halt within 90 days; $28M revenue impact; breach of 2 OEM delivery contracts.",
  },
  "ai-002": {
    id: "ai-002",
    title: "Fleet-Wide Battery Thermal Management Optimization",
    domain: "battery",
    priority: "high",
    confidenceScore: 87,
    businessImpact: "Suboptimal thermal management accelerating SOH degradation across 312 high-cycle vehicles.",
    recommendedAction: "Implement adaptive charging curve for vehicles with >800 cycles. Estimated 18-month RUL extension.",
    estimatedSavings: 3200000,
    affectedAssets: ["VH-0042", "VH-0189", "VH-0311", "+309 vehicles"],
    status: "pending",
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    rootCause: "Pattern analysis of 847K charging sessions reveals 23% operate above optimal temperature range during fast charging.",
    riskIfIgnored: "310 vehicle replacements required 14 months ahead of schedule. $12.4M unplanned capex.",
  },
  "ai-003": {
    id: "ai-003",
    title: "Manufacturing Line 3 Quality Drift — Root Cause Identified",
    domain: "manufacturing",
    priority: "high",
    confidenceScore: 91,
    businessImpact: "Line 3 defect rate 2.3x above UCL for 8 consecutive shifts — 847 non-conforming units at risk.",
    recommendedAction: "Replace welding electrode set on Station 7A-12B (last replaced 2,340 cycles ago, 340 over spec). Immediate recalibration of vision system.",
    estimatedSavings: 1840000,
    affectedAssets: ["LINE-3", "STA-7A", "STA-12B"],
    status: "accepted",
    createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    rootCause: "Electrode wear combined with coolant system partial blockage causing 0.3mm dimensional variance in cell casing welds.",
    riskIfIgnored: "Field failures in 0.8% of affected units. Potential recall of 340 vehicles already delivered.",
  },
  "ai-004": {
    id: "ai-004",
    title: "Scope 2 Emissions Reduction Opportunity — Renewable Switch",
    domain: "carbon",
    priority: "medium",
    confidenceScore: 82,
    businessImpact: "Oakland and Chicago facilities running on 78% grid electricity — switching to renewable PPAs would reduce Scope 2 by 31%.",
    recommendedAction: "Execute Power Purchase Agreements with NextEra Energy and Clearway Energy for Oakland and Chicago facilities. 24-month payback period.",
    estimatedSavings: 2100000,
    affectedAssets: ["Oakland Hub", "Chicago Depot"],
    status: "pending",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    rootCause: "Energy mix analysis shows 3 competitor facilities in same regions operating at <20% grid dependency.",
    riskIfIgnored: "Miss 2025 Scope 2 target by 18%. ESG rating downgrade risk; possible non-compliance with CA AB 1279.",
  },
  "ai-005": {
    id: "ai-005",
    title: "Fleet Charging Schedule Optimization",
    domain: "fleet",
    priority: "medium",
    confidenceScore: 79,
    businessImpact: "Current peak-hours charging increasing grid demand charges by $340K/year across 12 depot locations.",
    recommendedAction: "Shift 68% of charging sessions to off-peak window (11PM–6AM) using dynamic scheduling. Integrate with utility demand response programs.",
    estimatedSavings: 340000,
    affectedAssets: ["All 87 charging stations"],
    status: "pending",
    createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    rootCause: "73% of charging sessions initiate between 5PM–9PM peak window despite vehicles not requiring immediate availability.",
    riskIfIgnored: "No operational risk; $340K annual overspend continues.",
  },
  "ai-006": {
    id: "ai-006",
    title: "Nickel Supplier Concentration Risk Mitigation",
    domain: "supply-chain",
    priority: "high",
    confidenceScore: 88,
    businessImpact: "47% of nickel supply concentrated in Norilsk Nickel (risk score 94) — highest single-supplier concentration in portfolio.",
    recommendedAction: "Qualify Vale Brazil and POSCO as alternative nickel suppliers. Target 30% concentration reduction within 6 months.",
    estimatedSavings: 5600000,
    affectedAssets: ["Norilsk Nickel Contract", "Battery Cell Lines 1-4"],
    status: "dismissed",
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    rootCause: "Russia-EU sanctions expansion probability assessed at 71% based on geopolitical signal analysis.",
    riskIfIgnored: "Complete nickel supply disruption probability: 34% within 12 months. $18M production impact.",
  },
};

router.get("/ai/insights", (req, res) => {
  const status = req.query["status"] as string || "pending";
  let result = Object.values(insights);
  if (status && status !== "all") {
    result = result.filter(i => i.status === status);
  }
  res.json(result);
});

router.post("/ai/insights/:insightId/accept", (req, res) => {
  const insight = insights[req.params["insightId"]];
  if (!insight) { res.status(404).json({ error: "Not found" }); return; }
  insight.status = "accepted";
  res.json(insight);
});

router.post("/ai/insights/:insightId/dismiss", (req, res) => {
  const insight = insights[req.params["insightId"]];
  if (!insight) { res.status(404).json({ error: "Not found" }); return; }
  insight.status = "dismissed";
  res.json(insight);
});

router.get("/ai/agent-flow", (_req, res) => {
  res.json({
    nodes: [
      { id: "ag-supply", label: "Supply Chain Agent", type: "supply-chain", status: "active", lastActivity: new Date(Date.now() - 3 * 60000).toISOString(), insightsGenerated: 48, description: "Monitors 15 suppliers across 10 countries", position: { x: 400, y: 50 } },
      { id: "ag-battery", label: "Battery Intelligence Agent", type: "battery", status: "processing", lastActivity: new Date(Date.now() - 1 * 60000).toISOString(), insightsGenerated: 127, description: "Analyzes 1,547 battery assets in real-time", position: { x: 400, y: 180 } },
      { id: "ag-fleet", label: "Fleet Optimizer Agent", type: "fleet", status: "active", lastActivity: new Date(Date.now() - 5 * 60000).toISOString(), insightsGenerated: 83, description: "Optimizes routes, charging, and utilization", position: { x: 400, y: 310 } },
      { id: "ag-maintenance", label: "Maintenance Planner Agent", type: "maintenance", status: "active", lastActivity: new Date(Date.now() - 8 * 60000).toISOString(), insightsGenerated: 64, description: "Predictive maintenance scheduling", position: { x: 400, y: 440 } },
      { id: "ag-carbon", label: "Carbon Intelligence Agent", type: "carbon", status: "active", lastActivity: new Date(Date.now() - 12 * 60000).toISOString(), insightsGenerated: 41, description: "Tracks Scope 1/2/3 and reduction pathways", position: { x: 400, y: 570 } },
      { id: "ag-exec", label: "Executive Recommendation", type: "executive", status: "processing", lastActivity: new Date(Date.now() - 30000).toISOString(), insightsGenerated: 12, description: "Synthesizes all agents into C-suite briefings", position: { x: 400, y: 700 } },
    ],
    edges: [
      { id: "e-supply-battery", source: "ag-supply", target: "ag-battery", label: "Material Risk Signals", animated: true, dataFlow: "cobalt_risk_delta, nickel_supply_forecast" },
      { id: "e-battery-fleet", source: "ag-battery", target: "ag-fleet", label: "Battery State Data", animated: true, dataFlow: "soh_matrix, rul_predictions, thermal_alerts" },
      { id: "e-fleet-maint", source: "ag-fleet", target: "ag-maintenance", label: "Usage Patterns", animated: true, dataFlow: "cycle_counts, route_stress, charge_events" },
      { id: "e-maint-carbon", source: "ag-maintenance", target: "ag-carbon", label: "Activity Emissions", animated: true, dataFlow: "service_emissions, part_logistics_co2" },
      { id: "e-carbon-exec", source: "ag-carbon", target: "ag-exec", label: "Carbon Insights", animated: true, dataFlow: "scope_breakdown, net_zero_trajectory" },
      { id: "e-supply-exec", source: "ag-supply", target: "ag-exec", label: "Risk Briefs", animated: true, dataFlow: "geo_risk_alerts, supplier_concentration" },
    ],
  });
});

router.get("/ai/executive-summary", (_req, res) => {
  res.json({
    headline: "Fleet resilience improving — supply chain requires immediate cobalt action",
    summary: "AURA's AI agents have analyzed 2.4M data points across your fleet, supply chain, and manufacturing operations in the last 24 hours. Fleet readiness improved 2.6% to 74.8%, driven by successful Phase 2 EV transition progress. Battery asset health is stable at 87.4% average SOH, though 64 critical assets require intervention within 30 days. The highest-priority risk identified is cobalt supply chain exposure — DRC export restrictions threaten 34% of battery production capacity. Scope 2 emissions declined 8.3% month-over-month following Chicago depot renewable switch. Manufacturing OEE reached a Q3 record of 91.2% on Line 1 before a quality drift event on Line 3 was detected and root-caused.",
    topRisks: [
      { title: "Cobalt Supply Disruption", description: "DRC restrictions may impact 34% of battery production within 90 days", impact: "$28M revenue risk", domain: "supply-chain" },
      { title: "64 Critical Battery Assets", description: "Assets below 75% SOH requiring intervention within 30 days", impact: "$12.4M replacement cost", domain: "battery" },
      { title: "Norilsk Nickel Concentration", description: "47% nickel supply at risk from potential expanded sanctions", impact: "$18M supply disruption", domain: "supply-chain" },
    ],
    topOpportunities: [
      { title: "Fleet Charging Optimization", description: "Shift to off-peak charging to reduce demand charges", impact: "$340K annual savings", domain: "fleet" },
      { title: "Scope 2 PPA Transition", description: "Renewable energy contracts for 2 major facilities", impact: "$2.1M savings + ESG benefit", domain: "carbon" },
      { title: "Thermal Management Upgrade", description: "Extend RUL of 312 high-cycle vehicles by 18 months", impact: "$3.2M deferred capex", domain: "battery" },
    ],
    generatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
  });
});

export default router;
