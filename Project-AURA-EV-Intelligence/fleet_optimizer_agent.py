import pandas as pd


class FleetOptimizerAgent:
    def __init__(self, fleet_data: pd.DataFrame):
        self.fleet_data = fleet_data

    def readiness_score(self) -> float:
        if "ready" in self.fleet_data.columns:
            return float(self.fleet_data["ready"].mean() * 100)
        return 0.0

    def recommend_ev_models(self) -> list[str]:
        if "model" not in self.fleet_data.columns:
            return ["LFP-class EV fleet transition"]
        best_models = self.fleet_data.sort_values(by="score", ascending=False)
        return best_models["model"].head(3).tolist()


if __name__ == "__main__":
    print("FleetOptimizerAgent module loaded.")
