#!/usr/bin/env python3
"""Debug script for Google Custom Search API configuration"""

import os
import sys
import requests
from dotenv import load_dotenv

# Add the backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

def debug_google_api():
    """Step-by-step debugging of Google API configuration"""

    print("=" * 60)
    print("GOOGLE CUSTOM SEARCH API DEBUGGER")
    print("=" * 60)

    # Step 1: Check environment variables
    print("\n1. CHECKING ENVIRONMENT VARIABLES:")
    print("-" * 40)

    api_key = os.getenv("GOOGLE_API_KEY")
    search_engine_id = os.getenv("SEARCH_ENGINE_ID")

    if api_key:
        print(f"✓ GOOGLE_API_KEY: {api_key[:10]}...{api_key[-4:]}")
        print(f"  Length: {len(api_key)} characters")
    else:
        print("✗ GOOGLE_API_KEY not found in .env file")
        print("  Add it to your .env file: GOOGLE_API_KEY=your_key_here")
        return

    if search_engine_id:
        print(f"✓ SEARCH_ENGINE_ID: {search_engine_id}")
    else:
        print("✗ SEARCH_ENGINE_ID not found in .env file")
        print("  Add it to your .env file: SEARCH_ENGINE_ID=your_id_here")
        return

    # Step 2: Test basic API connectivity
    print("\n2. TESTING BASIC API CONNECTIVITY:")
    print("-" * 40)

    base_url = "https://www.googleapis.com/customsearch/v1"

    # Test with a simple web search (not image search)
    print("Testing regular web search...")
    params = {
        "key": api_key,
        "cx": search_engine_id,
        "q": "test"
    }

    try:
        response = requests.get(base_url, params=params, timeout=10)

        if response.status_code == 200:
            print("✓ Basic web search works!")
            data = response.json()
            if "items" in data:
                print(f"  Found {len(data['items'])} results")
            else:
                print("  No results, but API is working")

        elif response.status_code == 403:
            print("✗ API Access Forbidden (403)")
            error_data = response.json()
            error_msg = error_data.get("error", {})
            print(f"  Error message: {error_msg.get('message', 'Unknown')}")

            # Check for specific error reasons
            if "errors" in error_msg:
                for err in error_msg["errors"]:
                    print(f"  - {err.get('reason', 'unknown')}: {err.get('message', '')}")

            print("\n  TROUBLESHOOTING STEPS:")
            print("  1. Go to https://console.cloud.google.com/apis/dashboard")
            print("  2. Select your project")
            print("  3. Click 'ENABLE APIS AND SERVICES'")
            print("  4. Search for 'Custom Search API'")
            print("  5. Click on it and press 'ENABLE'")
            print("  6. Go to https://console.cloud.google.com/apis/credentials")
            print("  7. Check if your API key has any restrictions")

        elif response.status_code == 400:
            print("✗ Bad Request (400)")
            print("  Check your Search Engine ID is correct")

        elif response.status_code == 429:
            print("✗ Rate Limit Exceeded (429)")
            print("  You've exceeded your daily quota (100 requests/day for free tier)")

        else:
            print(f"✗ Unexpected status code: {response.status_code}")
            print(f"  Response: {response.text[:200]}")

    except Exception as e:
        print(f"✗ Request failed: {e}")

    # Step 3: Test image search specifically
    print("\n3. TESTING IMAGE SEARCH:")
    print("-" * 40)

    print("Testing image search...")
    params = {
        "key": api_key,
        "cx": search_engine_id,
        "q": "sunset",
        "searchType": "image",
        "num": 1
    }

    try:
        response = requests.get(base_url, params=params, timeout=10)

        if response.status_code == 200:
            print("✓ Image search works!")
            data = response.json()
            if "items" in data:
                print(f"  Found {len(data['items'])} images")
                first_image = data["items"][0]
                print(f"  First image: {first_image.get('title', 'No title')}")
            else:
                print("  No images found")

        elif response.status_code == 403:
            print("✗ Image search forbidden (403)")
            error_data = response.json()
            error_msg = error_data.get("error", {})
            print(f"  Error: {error_msg.get('message', 'Unknown')}")

            print("\n  ADDITIONAL TROUBLESHOOTING FOR IMAGE SEARCH:")
            print("  1. Go to https://programmablesearchengine.google.com/")
            print("  2. Select your search engine")
            print("  3. Go to 'Setup' → 'Basics'")
            print("  4. Make sure 'Image search' is ON")
            print("  5. Under 'Sites to search', ensure you have sites or 'Search the entire web' enabled")

        else:
            print(f"✗ Status code: {response.status_code}")

    except Exception as e:
        print(f"✗ Request failed: {e}")

    # Step 4: Check API quota
    print("\n4. CHECKING API QUOTA:")
    print("-" * 40)

    print("To check your quota:")
    print("1. Go to https://console.cloud.google.com/apis/api/customsearch.googleapis.com/metrics")
    print("2. Select your project")
    print("3. Check the 'Quotas' tab")
    print("4. Free tier allows 100 searches/day")

    # Step 5: Provide setup instructions
    print("\n5. COMPLETE SETUP CHECKLIST:")
    print("-" * 40)

    print("[ ] Enable Custom Search API in Google Cloud Console")
    print("[ ] Create API Key with no restrictions (or allow Custom Search API)")
    print("[ ] Create Custom Search Engine at https://programmablesearchengine.google.com/")
    print("[ ] Enable 'Image search' in search engine settings")
    print("[ ] Enable 'Search the entire web' or add specific sites")
    print("[ ] Copy Search Engine ID to .env file")
    print("[ ] Copy API Key to .env file")
    print("[ ] Verify you haven't exceeded daily quota (100/day free)")

    print("\n" + "=" * 60)
    print("END OF DEBUG REPORT")
    print("=" * 60)

if __name__ == "__main__":
    debug_google_api()