import os
import requests
from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    message: str
    success: bool

class StoryboardChatbot:
    def __init__(self):
        self.api_key = os.getenv("LANGFLOW_API_KEY")
        if not self.api_key:
            raise ValueError("LANGFLOW_API_KEY environment variable not found. Please set your API key in the environment variables.")

        # Langflow configuration - make URL and flow ID configurable
        langflow_host = os.getenv("LANGFLOW_HOST", "localhost:7860")
        flow_id = os.getenv("LANGFLOW_FLOW_ID", "d4064e94-7321-4b23-bdef-532fd2be559a")
        self.url = f"http://{langflow_host}/api/v1/run/{flow_id}"

        self.headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key
        }

    def generate_response(self, user_message: str, conversation_history: List[ChatMessage] = None, project_id: str = None) -> str:
        """Generate AI response for storyboard editing assistance using Langflow"""
        print("!!!!!")
        # Build context from conversation history
        context = ""
        if conversation_history:
            for msg in conversation_history[-5:]:  # Keep last 5 messages for context
                context += f"{msg.role}: {msg.content}\n"

        # Combine context with current message
        full_message = f"{context}user: {user_message}" if context else user_message

        # Langflow API payload
        payload = {
            "output_type": "chat",
            "input_type": "chat",
            "input_value": full_message
        }

        try:
            # Increase timeout to 6 minutes for Langflow processing
            response = requests.post(self.url, json=payload, headers=self.headers, timeout=360)
            response.raise_for_status()  # Raise exception for bad status codes

            # Parse Langflow response
            response_data = response.json()

            # Debug: Print response structure (remove in production)
            print(f"Langflow response: {response_data}")

            # Try multiple extraction paths for different Langflow response formats

            # Method 1: Direct text field
            if "text" in response_data:
                return response_data["text"]

            # Method 2: outputs array with text
            if "outputs" in response_data:
                outputs = response_data["outputs"]
                if isinstance(outputs, list) and len(outputs) > 0:
                    first_output = outputs[0]

                    # Try direct text in first output
                    if isinstance(first_output, dict) and "text" in first_output:
                        return first_output["text"]

                    # Try nested outputs structure
                    if isinstance(first_output, dict) and "outputs" in first_output:
                        nested_outputs = first_output["outputs"]
                        if isinstance(nested_outputs, list) and len(nested_outputs) > 0:
                            nested_output = nested_outputs[0]
                            if isinstance(nested_output, dict):
                                # Try various text fields
                                for text_field in ["text", "content", "message", "result"]:
                                    if text_field in nested_output:
                                        return str(nested_output[text_field])

                                # Try results structure
                                if "results" in nested_output:
                                    results = nested_output["results"]
                                    if isinstance(results, dict):
                                        # Try message.text structure
                                        if "message" in results and isinstance(results["message"], dict):
                                            if "text" in results["message"]:
                                                return results["message"]["text"]
                                        # Try direct text in results
                                        for text_field in ["text", "content", "message"]:
                                            if text_field in results:
                                                return str(results[text_field])

            # Method 3: session_id structure (common in Langflow)
            if "session_id" in response_data:
                # Look for outputs in session structure
                for key in ["outputs", "messages", "response"]:
                    if key in response_data and response_data[key]:
                        data = response_data[key]
                        if isinstance(data, list) and len(data) > 0:
                            item = data[0]
                            if isinstance(item, dict) and "text" in item:
                                return item["text"]

            # Fallback: return the entire response as string for debugging
            return f"Response received but couldn't extract text. Full response: {str(response_data)}"

        except requests.exceptions.Timeout:
            return "The AI service is taking too long to respond. Please try again with a shorter message."
        except requests.exceptions.RequestException as e:
            return f"I'm having trouble connecting to the AI service right now. Please try again later. Error: {str(e)}"
        except ValueError as e:
            return f"I received an unexpected response format. Please try again later. Error: {str(e)}"
        except Exception as e:
            return f"I'm having trouble processing your request right now. Please try again later. Error: {str(e)}"