import { Router } from "express";

const router = Router();

router.get("/carbon/overview", (_req, res) => {
  res.json({
    totalEmissions: 284700,
    scope1: 68200,
    scope2: 112400,
    scope3: 104100,
    netZeroTargetYear: 2040,
    currentReductionPercent: 32.6,
    targetReductionPercent: 50,
    carbonSaved: 137800,
    offsetsPurchased: 42300,
  });
});

router.get("/carbon/emission-trend", (req, res) => {
  const months = parseInt(req.query["months"] as string) || 24;
  const data = Array.from({ length: months }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - months + 1 + i);
    const factor = 1 - (i / months) * 0.28;
    const scope1 = Math.round(68200 * factor * (0.92 + Math.random() * 0.16));
    const scope2 = Math.round(112400 * factor * (0.92 + Math.random() * 0.16));
    const scope3 = Math.round(104100 * factor * (0.94 + Math.random() * 0.12));
    const targetFactor = 1 - (i / months) * 0.35;
    return {
      month: d.toLocaleString("default", { month: "short", year: "2-digit" }),
      scope1,
      scope2,
      scope3,
      total: scope1 + scope2 + scope3,
      target: Math.round(422300 * targetFactor),
    };
  });
  res.json(data);
});

router.get("/carbon/regional", (_req, res) => {
  res.json([
    { region: "North America", country: "USA", countryCode: "US", lat: 37.09, lng: -95.71, emissions: 98400, reduction: 34.2, intensity: 0.82 },
    { region: "North America", country: "Canada", countryCode: "CA", lat: 56.13, lng: -106.35, emissions: 18200, reduction: 28.7, intensity: 0.61 },
    { region: "Europe", country: "Germany", countryCode: "DE", lat: 51.17, lng: 10.45, emissions: 42100, reduction: 41.3, intensity: 0.74 },
    { region: "Europe", country: "UK", countryCode: "GB", lat: 55.38, lng: -3.44, emissions: 29800, reduction: 38.9, intensity: 0.68 },
    { region: "Asia Pacific", country: "China", countryCode: "CN", lat: 35.86, lng: 104.19, emissions: 62400, reduction: 19.8, intensity: 1.24 },
    { region: "Asia Pacific", country: "Japan", countryCode: "JP", lat: 36.2, lng: 138.25, emissions: 18700, reduction: 33.4, intensity: 0.71 },
    { region: "Asia Pacific", country: "South Korea", countryCode: "KR", lat: 37.57, lng: 127.97, emissions: 11200, reduction: 29.1, intensity: 0.78 },
    { region: "Latin America", country: "Brazil", countryCode: "BR", lat: -14.24, lng: -51.93, emissions: 3900, reduction: 22.6, intensity: 0.45 },
  ]);
});

router.get("/carbon/savings-breakdown", (_req, res) => {
  res.json([
    { category: "2022 Baseline", value: 422300, type: "increase" },
    { category: "Fleet Electrification", value: -58400, type: "decrease" },
    { category: "Renewable Energy", value: -42800, type: "decrease" },
    { category: "Process Efficiency", value: -18600, type: "decrease" },
    { category: "Material Recovery", value: -11200, type: "decrease" },
    { category: "Carbon Offsets", value: -6600, type: "decrease" },
    { category: "2024 Actual", value: 284700, type: "increase" },
  ]);
});

export default router;
