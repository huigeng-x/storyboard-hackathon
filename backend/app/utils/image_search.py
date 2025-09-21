import os
import requests
from typing import List, Dict, Optional
from dotenv import load_dotenv

load_dotenv()

class GoogleImageSearch:
    """Utility class for searching images using Google Custom Search API"""

    def __init__(self):
        self.api_key = os.getenv("GOOGLE_CSE_API_KEY")
        self.search_engine_id = os.getenv("SEARCH_ENGINE_ID")

        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        if not self.search_engine_id:
            raise ValueError("SEARCH_ENGINE_ID not found in environment variables")

        self.base_url = "https://www.googleapis.com/customsearch/v1"

    def search_images(
        self,
        query: str,
        num_results: int = 3,
        image_size: Optional[str] = None,
        image_type: Optional[str] = None,
        safe_search: str = "medium"
    ) -> List[Dict[str, any]]:
        """
        Search for images using Google Custom Search API

        Args:
            query: The search query string
            num_results: Number of results to return (max 10 per request)
            image_size: Size of images (small, medium, large, xlarge, xxlarge, huge)
            image_type: Type of image (clipart, face, lineart, stock, photo, animated)
            safe_search: Safe search setting (off, medium, high)

        Returns:
            List of dictionaries containing image information:
                - title: Image title
                - link: Direct link to the image
                - thumbnail: Thumbnail URL
                - context: Page context where image was found
                - width: Image width
                - height: Image height
                - size: File size
        """

        if num_results > 3:
            num_results = 3  # Google API limit per request

        print("api key", self.api_key)
        print("search engine id", self.search_engine_id)
        params = {
            "key": self.api_key,
            "cx": self.search_engine_id,
            "q": query,
            "searchType": "image",
            "num": num_results,
            "safe": safe_search
        }

        # Add optional parameters
        if image_size:
            params["imgSize"] = image_size
        if image_type:
            params["imgType"] = image_type

        try:
            response = requests.get(self.base_url, params=params, timeout=10)

            # Check for specific error codes
            if response.status_code == 403:
                error_data = response.json()
                error_msg = error_data.get("error", {}).get("message", "Unknown error")
                print(f"Google API Error 403: {error_msg}")
                print("Common causes:")
                print("1. API key is invalid or restricted")
                print("2. Custom Search API is not enabled in Google Cloud Console")
                print("3. Search Engine ID doesn't support image search")
                print("4. Billing is not enabled (for requests over free tier)")
                return []
            elif response.status_code == 429:
                print("Rate limit exceeded. You may have reached your daily quota.")
                return []

            response.raise_for_status()

            data = response.json()

            # Extract image information
            images = []
            if "items" in data:
                for item in data["items"]:
                    image_info = {
                        "title": item.get("title", ""),
                        "link": item.get("link", ""),
                        "displayLink": item.get("displayLink", ""),
                        "mime": item.get("mime", ""),
                        "fileFormat": item.get("fileFormat", ""),
                        "image": {
                            "contextLink": item.get("image", {}).get("contextLink", ""),
                            "height": item.get("image", {}).get("height", 0),
                            "width": item.get("image", {}).get("width", 0),
                            "byteSize": item.get("image", {}).get("byteSize", 0),
                            "thumbnailLink": item.get("image", {}).get("thumbnailLink", ""),
                            "thumbnailHeight": item.get("image", {}).get("thumbnailHeight", 0),
                            "thumbnailWidth": item.get("image", {}).get("thumbnailWidth", 0),
                        }
                    }
                    images.append(image_info)

            return images

        except requests.exceptions.RequestException as e:
            print(f"Error searching images: {e}")
            return []
        except ValueError as e:
            print(f"Error parsing response: {e}")
            return []

    def get_longest_title_jpeg_link(self, query: str, num_results: int = 3) -> Optional[str]:
        """
        Search for images and return the link of the JPEG image with the longest title

        Args:
            query: The search query string
            num_results: Number of results to search through (max 3)

        Returns:
            Link (URL) of the JPEG image with the longest title, or None if no JPEG images found
        """
        results = self.search_images(query, num_results)

        if not results:
            return None

        # Filter for jpeg images only
        jpeg_images = [
            img for img in results
            if img.get('mime') == 'image/jpeg' and img.get('fileFormat') == 'image/jpeg'
        ]

        if not jpeg_images:
            return None

        # Find the image with the longest title
        longest_title_image = max(jpeg_images, key=lambda x: len(x.get('title', '')))

        # Return just the link
        return longest_title_image.get('link')


def get_longest_title_image_link(images: List[Dict[str, any]]) -> Optional[str]:
    """
    From a list of image results, find the JPEG image with the longest title and return its link

    Args:
        images: List of image dictionaries from search results

    Returns:
        Link (URL) of the JPEG image with the longest title, or None if no JPEG images found
    """
    if not images:
        return None

    # Filter for jpeg images only
    jpeg_images = [
        img for img in images
        if img.get('mime') == 'image/jpeg' and img.get('fileFormat') == 'image/jpeg'
    ]

    if not jpeg_images:
        return None

    # Find the image with the longest title
    longest_title_image = max(jpeg_images, key=lambda x: len(x.get('title', '')))

    # Return just the link
    return longest_title_image.get('link')


# Example usage function
def search_image(query: str, num_results: int = 5) -> str:
    """
    Simple function to search for images

    Args:
        query: Search query
        num_results: Number of results to return

    Returns:
        List of image results
    """
    try:
        searcher = GoogleImageSearch()
        search_images = searcher.search_images(query, num_results=num_results)
        result = get_longest_title_image_link(search_images)
        return result
    except Exception as e:
        print(f"Error initializing image search: {e}")
        return []


if __name__ == "__main__":
    # Test the image search
    query = "sunset beach"
    print(f"Searching for: {query}")

    # Search for images
    search_image(query, num_results=3)
