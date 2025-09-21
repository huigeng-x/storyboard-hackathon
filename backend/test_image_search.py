#!/usr/bin/env python3
"""Test script for Google Image Search utility"""

import os
import sys
from dotenv import load_dotenv

# Add the backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

def test_image_search():
    """Test the image search functionality"""

    # Check environment variables
    print("Checking environment variables...")
    api_key = os.getenv("GOOGLE_API_KEY")
    search_engine_id = os.getenv("SEARCH_ENGINE_ID")

    if api_key:
        print(f"✓ GOOGLE_API_KEY found (length: {len(api_key)})")
    else:
        print("✗ GOOGLE_API_KEY not found")
        return

    if search_engine_id:
        print(f"✓ SEARCH_ENGINE_ID found: {search_engine_id}")
    else:
        print("✗ SEARCH_ENGINE_ID not found")
        return

    print("\nTesting image search...")

    try:
        from app.utils.image_search import GoogleImageSearch

        searcher = GoogleImageSearch()

        # Test with a simple query
        query = "sunset beach"
        print(f"\nSearching for: '{query}'")

        results = searcher.search_images(query, num_results=3)

        if results:
            print(f"\n✓ Successfully found {len(results)} images!")
            for i, img in enumerate(results, 1):
                print(f"\n{i}. Title: {img['title']}")
                print(f"   URL: {img['link']}")
                print(f"   Size: {img['image']['width']}x{img['image']['height']}")
                if img['image'].get('thumbnailLink'):
                    print(f"   Thumbnail: {img['image']['thumbnailLink'][:100]}...")
        else:
            print("\n✗ No images found. This could mean:")
            print("   1. The search engine is not configured for image search")
            print("   2. The API key doesn't have permission")
            print("   3. The search quota has been exceeded")

    except Exception as e:
        print(f"\n✗ Error during image search: {e}")
        print("\nPossible issues:")
        print("1. Check if your Google Custom Search Engine is configured to search images")
        print("2. Verify your API key has Custom Search API enabled in Google Cloud Console")
        print("3. Check if you've exceeded your daily quota (100 searches/day for free tier)")
        print("4. Ensure the Search Engine ID is correct")

        # Try a regular web search to see if the API works at all
        print("\n\nTrying a regular web search to test API connectivity...")
        try:
            import requests
            params = {
                "key": api_key,
                "cx": search_engine_id,
                "q": "test"
            }
            response = requests.get("https://www.googleapis.com/customsearch/v1", params=params)
            if response.status_code == 200:
                print("✓ Regular web search works! The issue is specific to image search.")
                print("  Make sure image search is enabled in your Custom Search Engine settings.")
            else:
                print(f"✗ API returned status code: {response.status_code}")
                print(f"  Response: {response.text[:500]}...")
        except Exception as e2:
            print(f"✗ Could not test regular search: {e2}")

if __name__ == "__main__":
    test_image_search()