import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression


class BatteryAgent:
    def __init__(self, data: pd.DataFrame):
        self.data = data

    def predict_soh(self) -> float:
        if "soh" in self.data.columns:
            return float(self.data["soh"].mean())
        return 100.0

    def predict_rul(self) -> int:
        if "cycle" in self.data.columns and "capacity" in self.data.columns:
            model = LinearRegression()
            X = self.data[["cycle"]]
            y = self.data["capacity"]
            model.fit(X, y)
            return int(max(0, (0.8 - model.intercept_) / model.coef_[0]))
        return 365

    def generate_alerts(self) -> list[str]:
        alerts = []
        soh = self.predict_soh()
        if soh < 85:
            alerts.append("SoH below threshold: maintenance inspection recommended.")
        if soh < 75:
            alerts.append("Battery health critical: prioritize replacement candidate.")
        return alerts


if __name__ == "__main__":
    print("BatteryAgent module loaded.")
