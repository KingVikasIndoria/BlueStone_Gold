import sys
import http.client

API_KEY = "ff6f2c650amshaa45dcbb3f35310p147e90jsnc32fbac634b8"
CITY = sys.argv[1] if len(sys.argv) > 1 else "Chennai"

conn = http.client.HTTPSConnection("gold-silver-live-price-india.p.rapidapi.com")
headers = {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': "gold-silver-live-price-india.p.rapidapi.com",
    'city': CITY
}
conn.request("GET", "/gold_price_india_city_value/", headers=headers)
res = conn.getresponse()
data = res.read()
print(data.decode("utf-8"))
