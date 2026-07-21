import pandas as pd


class SupplyChainAgent:
    def __init__(self, supply_data: pd.DataFrame):
        self.supply_data = supply_data

    def compute_hhi(self) -> float:
        if "share" not in self.supply_data.columns:
            return 0.0
        shares = self.supply_data["share"].astype(float) / 100
        return float((shares ** 2).sum() * 10000)

    def geopolitical_risk(self) -> dict[str, str]:
        risks = {}
        if "country" in self.supply_data.columns:
            country_counts = self.supply_data["country"].value_counts(normalize=True)
            top_country = country_counts.idxmax()
            risks["highest_exposure"] = top_country
            risks["risk_level"] = "High" if country_counts.max() > 0.4 else "Moderate"
        return risks


if __name__ == "__main__":
    print("SupplyChainAgent module loaded.")
