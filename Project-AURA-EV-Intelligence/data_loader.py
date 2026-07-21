import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent


def load_nasa_battery_data(dataset_name: str) -> pd.DataFrame:
    path = BASE_DIR / "data" / "nasa" / f"{dataset_name}.csv"
    return pd.read_csv(path)


def load_supply_data(filename: str) -> pd.DataFrame:
    path = BASE_DIR / "data" / "supply" / filename
    return pd.read_csv(path)


if __name__ == "__main__":
    print(load_nasa_battery_data("B0005").head())
    print(load_supply_data("minerals_trade.csv").head())
