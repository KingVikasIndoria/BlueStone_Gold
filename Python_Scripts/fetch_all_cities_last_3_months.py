import http.client
import json
import os
import sys
import time
import argparse
from datetime import datetime, timedelta
from typing import Optional, Dict, List

API_KEY = os.environ.get("RAPIDAPI_KEY", "ff6f2c650amshaa45dcbb3f35310p147e90jsnc32fbac634b8")
API_HOST = "gold-silver-live-price-india.p.rapidapi.com"
CITIES_LIST_PATH = "cities_list.txt"
DATA_DIR = os.path.join("data", "cities")
DAYS_BACK_DEFAULT = 90  # ~3 months
REQUEST_DELAY_SEC_DEFAULT = 0.15  # ~6-7 req/sec -> ~360-420/min, under 1000/min
PER_CITY_PAUSE_SEC_DEFAULT = 0.0


def normalize_city_filename(city_name: str) -> str:
	return city_name.strip().lower().replace(" ", "_")


def safe_city_header_value(city_name: str) -> str:
	# Ensure header value is latin-1 encodable (http.client requirement)
	try:
		city_name.encode('latin-1')
		return city_name
	except UnicodeEncodeError:
		return city_name.encode('latin-1', 'ignore').decode('latin-1')


def fetch_historical_for_date(conn: http.client.HTTPSConnection, city: str, date_str: str) -> Optional[Dict]:
	city_header = safe_city_header_value(city)
	headers = {
		'x-rapidapi-key': API_KEY,
		'x-rapidapi-host': API_HOST,
		'city': city_header,
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
		price_22k = float(data.get(f"{city}_22k"))
		price_24k = float(data.get(f"{city}_24k"))
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


def process_city(city: str, days_back: int, request_delay_sec: float) -> int:
	city_filename = normalize_city_filename(city)
	output_path = os.path.join(DATA_DIR, f"{city_filename}.json")
	os.makedirs(os.path.dirname(output_path), exist_ok=True)

	conn = http.client.HTTPSConnection(API_HOST)

	today = datetime.utcnow().date()
	dates = [(today - timedelta(days=delta)).strftime("%Y-%m-%d") for delta in range(0, days_back)]

	results: List[Dict] = []
	ok = 0
	for idx, d in enumerate(dates, start=1):
		item = fetch_historical_for_date(conn, city, d)
		if item is not None:
			results.append(item)
			ok += 1
		else:
			print(f"  - miss {idx}/{len(dates)} {city} @ {d}")
		# rate limiting between requests
		time.sleep(request_delay_sec)

	# Sort ascending by date for stable chronology
	results.sort(key=lambda x: x["date"])  # ISO sort-safe

	with open(output_path, "w", encoding="utf-8") as f:
		json.dump(results, f, indent=2)

	print(f"Saved {ok}/{len(dates)} for {city} -> {output_path}")
	return ok


def main() -> None:
	parser = argparse.ArgumentParser(description="Fetch last N days for all cities with rate limiting")
	parser.add_argument("--days", type=int, default=DAYS_BACK_DEFAULT, help="Days back to fetch (default 90)")
	parser.add_argument("--sample", type=int, default=0, help="Only process first N cities (0 = all)")
	parser.add_argument("--start-from", type=str, default="", help="Start from this city name (case-insensitive)")
	parser.add_argument("--req-delay", type=float, default=REQUEST_DELAY_SEC_DEFAULT, help="Delay between requests in seconds")
	parser.add_argument("--city-pause", type=float, default=PER_CITY_PAUSE_SEC_DEFAULT, help="Pause between cities in seconds")
	args = parser.parse_args()

	# Load cities list (utf-8-sig to strip BOM if present)
	with open(CITIES_LIST_PATH, "r", encoding="utf-8-sig") as f:
		cities = [line.strip().lstrip('\ufeff') for line in f if line.strip()]

	# Filter cities based on start-from parameter
	if args.start_from:
		try:
			start_index = next(i for i, city in enumerate(cities) if city.lower() == args.start_from.lower())
			cities = cities[start_index:]
			print(f"Starting from city '{cities[0]}' (index {start_index})")
		except StopIteration:
			print(f"City '{args.start_from}' not found in cities list")
			return
	elif args.sample and args.sample > 0:
		cities = cities[:args.sample]

	print(f"Starting fetch: cities={len(cities)}, days={args.days}, req_delay={args.req_delay}s, city_pause={args.city_pause}s")

	total_ok = 0
	total_expected = len(cities) * args.days
	start = time.time()
	for idx, city in enumerate(cities, start=1):
		print(f"\n[{idx}/{len(cities)}] {city}")
		ok = process_city(city, args.days, args.req_delay)
		total_ok += ok
		if args.city_pause > 0:
			time.sleep(args.city_pause)

	elapsed = time.time() - start
	print(f"\nDone. Saved {total_ok}/{total_expected} records across {len(cities)} cities in {elapsed:.1f}s")


if __name__ == "__main__":
	main()
