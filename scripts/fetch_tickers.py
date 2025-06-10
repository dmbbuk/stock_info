import requests
import json

API_KEY = "cu69ebpr01qujm3q44fgcu69ebpr01qujm3q44g0"
EXCHANGE = "US"  # or "BINANCE", "TSE" 등

def fetch_tickers():
    url = f"https://finnhub.io/api/v1/stock/symbol?exchange={EXCHANGE}&token={API_KEY}"
    resp = requests.get(url)
    if resp.status_code != 200:
        print("Failed to fetch:", resp.status_code)
        return

    data = resp.json()
    refined = [
        {
            "symbol": item["symbol"],
            "name": item["description"],
            "type": item["type"],
        }
        for item in data
    ]

    with open(f"tickers-{EXCHANGE}.json", "w", encoding="utf-8") as f:
        json.dump(refined, f, indent=2, ensure_ascii=False)

    print(f"{len(refined)} tickers saved to tickers-{EXCHANGE}.json")


if __name__ == "__main__":
    fetch_tickers()
