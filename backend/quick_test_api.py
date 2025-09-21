#!/usr/bin/env python3
"""Quick test after enabling Custom Search API"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
search_engine_id = os.getenv("SEARCH_ENGINE_ID")

print("Testing Google Custom Search API...")
print(f"API Key: {api_key[:10]}...{api_key[-4:]}")
print(f"Search Engine ID: {search_engine_id}\n")

# Test URL
url = f"https://www.googleapis.com/customsearch/v1"
params = {
    "key": api_key,
    "cx": search_engine_id,
    "q": "test",
    "num": 1
}

response = requests.get(url, params=params)

if response.status_code == 200:
    print("✅ SUCCESS! API is working!")
    print("Now testing image search...")

    # Test image search
    params["searchType"] = "image"
    img_response = requests.get(url, params=params)

    if img_response.status_code == 200:
        print("✅ Image search is working too!")
    else:
        print(f"⚠️ Image search failed: {img_response.status_code}")
        print("Make sure 'Image search' is enabled in your search engine settings")
else:
    print(f"❌ API still blocked. Status: {response.status_code}")
    print("Error:", response.json().get("error", {}).get("message", "Unknown"))
    print("\nPlease follow these steps:")
    print("1. Go to https://console.cloud.google.com/apis/library")
    print("2. Search for 'Custom Search API'")
    print("3. Click ENABLE")