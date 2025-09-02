import http.client
import json
import os
import time
from datetime import datetime, timedelta
from typing import Optional, Dict, List

API_KEY = os.environ.get("RAPIDAPI_KEY", "ff6f2c650amshaa45dcbb3f35310p147e90jsnc32fbac634b8")
API_HOST = "gold-silver-live-price-india.p.rapidapi.com"

# Resolve project root as two levels up from this file, but also support running from repo root
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, os.pardir))  # one up is repo root here
CITIES_LIST_CANDIDATES = [
    os.path.join(PROJECT_ROOT, "cities_list.txt"),
    os.path.join(SCRIPT_DIR, "..", "cities_list.txt"),
    os.path.join(os.getcwd(), "cities_list.txt"),
]
for p in CITIES_LIST_CANDIDATES:
    if os.path.exists(p):
        CITIES_LIST_PATH = p
        break
else:
    CITIES_LIST_PATH = CITIES_LIST_CANDIDATES[0]

DATA_DIR = os.path.join(PROJECT_ROOT, "data", "cities")
MAX_DAYS = 90
REQUEST_DELAY_SEC = 0.2


def _normalize_city_to_filename(city_name: str) -> str:
    return city_name.strip().lower().replace(" ", "_")


def _ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def _request(conn: http.client.HTTPSConnection, path: str, headers: Dict[str, str]) -> Optional[Dict]:
    try:
        conn.request("GET", path, headers=headers)
        res = conn.getresponse()
        raw = res.read()
        if res.status != 200:
            return None
        return json.loads(raw.decode("utf-8"))
    except Exception:
        return None


def fetch_today(conn: http.client.HTTPSConnection, city: str) -> Optional[Dict]:
    headers = {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
        'city': city
    }
    data = _request(conn, "/gold_price_india_city_value/", headers)
    if not data:
        return None
    try:
        status_code = int(data.get("Status_code"))
        if status_code != 200:
            return None
        return {
            "date": datetime.utcnow().strftime("%Y-%m-%d"),
            "timestamp": datetime.utcnow().isoformat(),
            "22k": float(data.get(f"{city}_22k")),
            "24k": float(data.get(f"{city}_24k")),
            "currency": data.get("Currency") or "INR",
            "unit": data.get("Unit") or "1 Gram",
            "status_code": status_code,
        }
    except Exception:
        return None


def fetch_for_date(conn: http.client.HTTPSConnection, city: str, date_str: str) -> Optional[Dict]:
    headers = {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
        'city': city,
        'required-date-yyyy-mm-dd': date_str,
    }
    data = _request(conn, "/gold_historical_price_india_city_value/", headers)
    if not data:
        return None
    try:
        status_code = int(data.get("Status_code"))
        if status_code != 200:
            return None
        return {
            "date": date_str,
            "timestamp": datetime.utcnow().isoformat(),
            "22k": float(data.get(f"{city}_22k")),
            "24k": float(data.get(f"{city}_24k")),
            "currency": data.get("Currency") or "INR",
            "unit": data.get("Unit") or "1 Gram",
            "status_code": status_code,
        }
    except Exception:
        return None


def upsert_city_records(city: str, new_records: List[Dict]) -> bool:
    _ensure_dir(DATA_DIR)
    path = os.path.join(DATA_DIR, f"{_normalize_city_to_filename(city)}.json")
    existing: List[Dict] = []
    if os.path.exists(path):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                loaded = json.load(f)
                if isinstance(loaded, list):
                    existing = loaded
        except Exception:
            existing = []
    # index by date, then merge
    by_date: Dict[str, Dict] = {rec.get('date'): rec for rec in existing if isinstance(rec, dict)}
    for rec in new_records:
        by_date[rec['date']] = rec
    # make list, sort asc, trim to last MAX_DAYS
    merged = list(by_date.values())
    merged.sort(key=lambda r: r.get('date', ''))
    if len(merged) > MAX_DAYS:
        merged = merged[-MAX_DAYS:]
    try:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(merged, f, indent=2, ensure_ascii=False)
        return True
    except Exception:
        return False


def main() -> None:
    # load cities
    with open(CITIES_LIST_PATH, 'r', encoding='utf-8') as f:
        cities = [line.strip() for line in f if line.strip()]

    conn = http.client.HTTPSConnection(API_HOST)
    today = datetime.utcnow().date()
    yesterday = (today - timedelta(days=1)).strftime('%Y-%m-%d')

    ok = 0
    fail = 0
    for idx, city in enumerate(cities, 1):
        print(f"[{idx}/{len(cities)}] {city} -> fetching yesterday & today …")
        # yesterday first (historical), then today
        recs: List[Dict] = []
        y = fetch_for_date(conn, city, yesterday)
        if y:
            recs.append(y)
        t = fetch_today(conn, city)
        if t:
            recs.append(t)
        if not recs:
            print(f"  ✗ no data for {city}")
            fail += 1
        else:
            if upsert_city_records(city, recs):
                print(f"  ✓ updated {city}: {', '.join(r['date'] for r in recs)}")
                ok += 1
            else:
                print(f"  ✗ write failed for {city}")
                fail += 1
        time.sleep(REQUEST_DELAY_SEC)

    print(f"Done. Success={ok}, Failed={fail}")


if __name__ == '__main__':
    main()
