import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor


class BatteryAgentUpgraded:
    def __init__(self, data: pd.DataFrame):
        self.data = data

    def preprocess(self) -> pd.DataFrame:
        df = self.data.copy()
        if "cycle" in df.columns and "capacity" in df.columns:
            df = df[["cycle", "capacity"]].dropna()
        return df

    def advanced_rul_estimate(self) -> float:
        df = self.preprocess()
        if df.empty:
            return 0.0
        model = RandomForestRegressor(n_estimators=10, random_state=42)
        X = df[["cycle"]]
        y = df["capacity"]
        model.fit(X, y)
        prediction = model.predict([[max(X["cycle"]) + 50]])
        return float(prediction[0])

    def generate_recommendations(self) -> dict[str, str]:
        soh = self.data["soh"].mean() if "soh" in self.data.columns else 100.0
        return {
            "maintenance": "Schedule inspection" if soh < 90 else "Normal operation",
            "replacement": "Consider LFP swap" if soh < 80 else "No swap required",
        }


if __name__ == "__main__":
    print("BatteryAgentUpgraded module loaded.")
