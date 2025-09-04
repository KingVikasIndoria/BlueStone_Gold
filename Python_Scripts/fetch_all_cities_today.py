import http.client
import json
import os
import time
import sys
from datetime import datetime

# Ensure stdout/stderr can print Unicode on Windows terminals
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

# API configuration
API_HOST = "gold-silver-live-price-india.p.rapidapi.com"
API_KEY = os.getenv("RAPIDAPI_KEY", "")  # better for security
if not API_KEY:
    raise RuntimeError("RAPIDAPI_KEY environment variable is not set")

def fetch_city_price(city_name):
    """Fetch today's gold price for a specific city"""
    try:
        conn = http.client.HTTPSConnection(API_HOST)
        
        headers = {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': API_HOST,
            'city': city_name
        }
        
        conn.request("GET", "/gold_price_india_city_value/", headers=headers)
        res = conn.getresponse()
        data = res.read()
        
        if res.status == 200:
            response_data = json.loads(data.decode("utf-8"))
            return response_data
        else:
            print(f"Error for {city_name}: Status {res.status}")
            return None
            
    except Exception as e:
        print(f"Exception for {city_name}: {str(e)}")
        return None

def _normalize_city_to_filename(city_name: str) -> str:
    return city_name.lower().replace(' ', '_').replace('(', '').replace(')', '')

def update_city_json(city_name, price_data, max_days: int = 90):
    """Append/replace today's data in the city's JSON and keep a rolling window of max_days (default 90)."""
    try:
        os.makedirs("data/cities", exist_ok=True)
        json_file_path = f"data/cities/{_normalize_city_to_filename(city_name)}.json"
        
        today_iso = datetime.now().strftime("%Y-%m-%d")
        now_ts = datetime.now().isoformat()
        today_data = {
            "date": today_iso,
            "timestamp": now_ts,
            "22k": price_data.get(f"{city_name}_22k"),
            "24k": price_data.get(f"{city_name}_24k"),
            "currency": price_data.get("Currency", "INR"),
            "unit": price_data.get("Unit", "1 Gram"),
            "status_code": price_data.get("Status_code")
        }
        
        records = []
        if os.path.exists(json_file_path):
            try:
                with open(json_file_path, 'r', encoding='utf-8') as f:
                    loaded = json.load(f)
                    if isinstance(loaded, list):
                        records = loaded
            except Exception:
                records = []
        
        # Replace today's record if exists, else append
        replaced = False
        for idx, rec in enumerate(records):
            if rec.get("date") == today_iso:
                records[idx] = today_data
                replaced = True
                break
        if not replaced:
            records.append(today_data)
        
        # Keep only last max_days
        records.sort(key=lambda r: r.get("date", ""))
        if len(records) > max_days:
            records = records[-max_days:]
        
        with open(json_file_path, 'w', encoding='utf-8') as f:
            json.dump(records, f, indent=2, ensure_ascii=False)
            
        return True
        
    except Exception as e:
        print(f"Error writing JSON for {city_name}: {str(e)}")
        return False

def main():
    """Main function to process cities from a text file"""
    print("Starting to fetch gold prices for cities...")
    print(f"Current time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    try:
        with open("cities_list.txt", "r", encoding="utf-8") as f:
            cities = [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        print("Error: cities_list.txt not found!")
        return
    
    print(f"Found {len(cities)} cities to process")
    
    successful = 0
    failed = 0
    
    for i, city in enumerate(cities, 1):
        print(f"[{i}/{len(cities)}] Processing: {city}")
        
        price_data = fetch_city_price(city)
        
        if price_data and price_data.get("Status_code") == 200:
            if update_city_json(city, price_data, max_days=90):
                # Avoid special glyphs that can break Windows console encodings
                print(f"OK {city}: 22K={price_data.get(f'{city}_22k')}, 24K={price_data.get(f'{city}_24k')}")
                successful += 1
            else:
                print(f"ERR {city}: Failed to write JSON")
                failed += 1
        else:
            print(f"ERR {city}: No data or API error")
            failed += 1
        
        time.sleep(3)  # pause between requests
    
    print(f"\n=== SUMMARY ===")
    print(f"Total cities processed: {len(cities)}")
    print(f"Successful: {successful}")
    print(f"Failed: {failed}")
    print(f"Completion time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()
