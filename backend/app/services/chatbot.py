import os
from openai import OpenAI
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
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def generate_response(self, user_message: str, conversation_history: List[ChatMessage] = None) -> str:
        """Generate AI response for storyboard editing assistance"""

        # System prompt for storyboard editing context
        system_prompt = """You are an AI assistant specialized in storyboard editing and video content creation.
        You help users iterate and improve their storyboards by providing specific, actionable suggestions.

        Your expertise includes:
        - Improving narrative flow and pacing
        - Enhancing visual storytelling
        - Optimizing dialogue and messaging
        - Adding dramatic elements or simplifying complex content
        - Creating effective call-to-actions
        - Adjusting timing and transitions

        Always provide specific, actionable advice that the user can implement in their storyboard panels.
        Keep responses concise but helpful, and ask clarifying questions when needed."""

        # Build conversation messages
        messages = [{"role": "system", "content": system_prompt}]

        # Add conversation history if provided
        if conversation_history:
            for msg in conversation_history[-5:]:  # Keep last 5 messages for context
                messages.append({"role": msg.role, "content": msg.content})

        # Add current user message
        messages.append({"role": "user", "content": user_message})

        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=500,
                temperature=0.7
            )

            return response.choices[0].message.content

        except Exception as e:
            return f"I'm having trouble processing your request right now. Please try again later. Error: {str(e)}"