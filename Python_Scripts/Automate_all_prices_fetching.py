# NOTE: This legacy script simulates data and is not used in production.
# Use fetch_all_cities_today.py for real data fetching and 90-day rolling windows.
import http.client
import json
import os
import random
from datetime import datetime, timedelta

# Config
API_KEY = "ff6f2c650amshaa45dcbb3f35310p147e90jsnc32fbac634b8"
API_HOST = "gold-silver-live-price-india.p.rapidapi.com"
CITIES_LIST_PATH = "cities_list.txt"  # Path to your cities list
DATA_DIR = "data/cities"
os.makedirs(DATA_DIR, exist_ok=True)

# Read all cities from the file
with open(CITIES_LIST_PATH, "r", encoding="utf-8") as f:
    cities = [line.strip() for line in f if line.strip()]

for CITY in cities:
    JSON_PATH = os.path.join(DATA_DIR, f"{CITY.lower().replace(' ', '_')}.json")

    for i in range(10000):
    # Fetch today's price
        conn = http.client.HTTPSConnection(API_HOST)
        headers = {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': API_HOST,
            'city': CITY
        }
        conn.request("GET", "/gold_price_india_city_value/", headers=headers)
        res = conn.getresponse();
        print(res.status);
        data = res.read()
    try:
        result = json.loads(data.decode("utf-8"))
    except Exception as e:
        print(f"Error decoding JSON for {CITY}: {e}")
        continue

    # Construct the keys for 22k and 24k price dynamically
    city_key_22k = f"{CITY}_22k"
    city_key_24k = f"{CITY}_24k"

    # Extract prices and date
    try:
        today_price_22k = float(result[city_key_22k])
        today_price_24k = float(result[city_key_24k])
        today = result['Price_Date(Today)'].strip()
    except KeyError as e:
        print(f"Key error for {CITY}: {e}. Response was: {result}")
        continue

    # Always simulate the previous 9 days based on today's price
    price_data = []
    for i in range(9, 0, -1):
        date = (datetime.strptime(today, "%Y-%m-%d") - timedelta(days=i)).strftime("%Y-%m-%d")
        simulated_price_22k = round(today_price_22k * random.uniform(0.98, 1.02), 2)
        simulated_price_24k = round(today_price_24k * random.uniform(0.98, 1.02), 2)
        price_data.append({
            "date": date,
            "price_22k": simulated_price_22k,
            "price_24k": simulated_price_24k
        })

    # Add today's prices
    price_data.append({
        "date": today,
        "price_22k": today_price_22k,
        "price_24k": today_price_24k
    })

    # Keep only last 10 days
    price_data = price_data[-10:]

    # Save JSON
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(price_data, f, indent=2)

    print(f"Updated {JSON_PATH} with latest 22k and 24k prices (previous days simulated).")