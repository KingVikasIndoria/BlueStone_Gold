import http.client
import json
import os
from datetime import datetime, timedelta
import time

API_KEY = os.environ.get("RAPIDAPI_KEY", "ff6f2c650amshaa45dcbb3f35310p147e90jsnc32fbac634b8")
API_HOST = "gold-silver-live-price-india.p.rapidapi.com"
CITY = "Chennai"
OUTPUT_PATH = os.path.join("data", "cities", "chennai.json")
DAYS_BACK = 90  # ~3 months


def fetch_historical_for_date(conn: http.client.HTTPSConnection, date_str: str):
	headers = {
		'x-rapidapi-key': API_KEY,
		'x-rapidapi-host': API_HOST,
		'city': CITY,
		'required-date-yyyy-mm-dd': date_str,
	}
	conn.request("GET", "/gold_historical_price_india_city_value/", headers=headers)
	res = conn.getresponse()
	raw = res.read()

	try:
		data = json.loads(raw.decode("utf-8"))
	except Exception:
		return None

	try:
		status_code = int(data.get("Status_code"))
		price_22k = float(data.get(f"{CITY}_22k"))
		price_24k = float(data.get(f"{CITY}_24k"))
		currency = data.get("Currency") or "INR"
		unit = data.get("Unit") or "1 Gram"
		requested_date = data.get("Requested_Date") or date_str
	except Exception:
		return None

	if status_code != 200:
		return None

	return {
		"date": requested_date,
		"timestamp": datetime.utcnow().isoformat(),
		"22k": price_22k,
		"24k": price_24k,
		"currency": currency,
		"unit": unit,
		"status_code": status_code,
	}


def main() -> None:
	os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

	conn = http.client.HTTPSConnection(API_HOST)

	today = datetime.utcnow().date()
	dates = [(today - timedelta(days=delta)).strftime("%Y-%m-%d") for delta in range(0, DAYS_BACK)]

	results = []
	for d in dates:
		item = fetch_historical_for_date(conn, d)
		if item is not None:
			results.append(item)
		# polite delay; tune if needed
		time.sleep(0.15)

	# Sort ascending by date
	results.sort(key=lambda x: x["date"])  # ISO date safe

	with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
		json.dump(results, f, indent=2)

	print(f"Wrote {len(results)} records to {OUTPUT_PATH}")


if __name__ == "__main__":
	main()
