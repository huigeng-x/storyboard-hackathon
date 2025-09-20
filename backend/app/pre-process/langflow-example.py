import requests
import os

# API Configuration
url = "http://localhost:7860/api/v1/run/32b9d163-b971-4ee2-a280-1ffa05a79304"

# Request payload configuration 
payload = {
    "output_type": "chat",
    "input_type": "chat",
    "input_value": "What is the company name?"
}

# Request headers - no API key needed for local instance
headers = {
    "Content-Type": "application/json"
}

try:
    # Send API request
    response = requests.request("POST", url, json=payload, headers=headers)
    response.raise_for_status()  # Raise exception for bad status codes

    # Print response
    print(response.text)

except requests.exceptions.RequestException as e:
    print(f"Error making API request: {e}")
except ValueError as e:
    print(f"Error parsing response: {e}")