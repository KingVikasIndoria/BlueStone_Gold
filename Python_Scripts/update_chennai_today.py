import http.client
import json
import os
from datetime import datetime

API_KEY = os.environ.get("RAPIDAPI_KEY", "ff6f2c650amshaa45dcbb3f35310p147e90jsnc32fbac634b8")
API_HOST = "gold-silver-live-price-india.p.rapidapi.com"
CITY = "Chennai"
DATA_PATH = os.path.join("data", "cities", "chennai.json")
MAX_DAYS = 90

def fetch_today_chennai():
    conn = http.client.HTTPSConnection(API_HOST)
    headers = {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
        'city': CITY
    }
    conn.request("GET", "/gold_price_india_city_value/", headers=headers)
    res = conn.getresponse()
    body = res.read()
    try:
        data = json.loads(body.decode("utf-8"))
    except Exception:
        print(f"API decode failed. status={res.status}, body={body[:200]!r}")
        return None
    if res.status != 200 or str(data.get("Status_code")) != "200":
        print(f"API returned no data. status={res.status}, payload={data}")
        return None
    try:
        record = {
            "date": datetime.utcnow().strftime("%Y-%m-%d"),
            "timestamp": datetime.utcnow().isoformat(),
            "22k": float(data.get(f"{CITY}_22k")),
            "24k": float(data.get(f"{CITY}_24k")),
            "currency": data.get("Currency") or "INR",
            "unit": data.get("Unit") or "1 Gram",
            "status_code": int(data.get("Status_code")),
        }
        return record
    except Exception as e:
        print(f"Parsing error: {e}. payload={data}")
        return None

def upsert_record(path: str, rec: dict):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    existing = []
    if os.path.exists(path):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                existing = json.load(f)
        except Exception:
            existing = []
    by_date = {r.get('date'): r for r in existing if isinstance(r, dict)}
    by_date[rec['date']] = rec
    merged = list(by_date.values())
    merged.sort(key=lambda r: r.get('date', ''))
    if len(merged) > MAX_DAYS:
        merged = merged[-MAX_DAYS:]
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(merged, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    rec = fetch_today_chennai()
    if not rec:
        raise SystemExit(1)
    upsert_record(DATA_PATH, rec)
    print(f"Updated {DATA_PATH} with {rec['date']} 22k={rec['22k']} 24k={rec['24k']}")
