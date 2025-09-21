from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.services.chatbot import StoryboardChatbot, ChatRequest, ChatResponse
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Initialize chatbot service
chatbot_service = StoryboardChatbot()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello from FastAPI backend!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "backend"}

@app.get("/api/test")
async def test_endpoint():
    return {
        "success": True,
        "data": "This is a test endpoint",
        "timestamp": "2025-01-20"
    }

class ProjectRequest(BaseModel):
    projectId: str
    typeId: int
    typeName: str
    userInput: str

@app.post("/api/create-project")
async def create_project(request: ProjectRequest):
    """Create a new project folder and JSON file"""
    try:
        # Create project directory
        project_dir = Path(__file__).parent.parent.parent / "data" / f"project_{request.projectId}"
        project_dir.mkdir(parents=True, exist_ok=True)

        # Create project metadata
        project_data = {
            "id": request.projectId,
            "type": request.typeId,
            "typeName": request.typeName,
            "userInput": request.userInput,
            "createdAt": datetime.now().isoformat(),
            "storyboard": None
        }

        # Save project file
        project_file = project_dir / f"project_type{request.typeId}.json"
        with open(project_file, "w") as f:
            json.dump(project_data, f, indent=2)

        return {"success": True, "projectId": request.projectId, "projectDir": str(project_dir)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating project: {str(e)}")

@app.get("/api/project/{project_id}")
async def get_project(project_id: str):
    """Get project data by ID"""
    try:
        # Find project directory
        project_dir = Path(__file__).parent.parent.parent / "data" / f"project_{project_id}"
        if not project_dir.exists():
            raise HTTPException(status_code=404, detail="Project not found")

        # Find project file
        project_files = list(project_dir.glob("project_type*.json"))
        if not project_files:
            raise HTTPException(status_code=404, detail="Project file not found")

        # Read project data
        with open(project_files[0], "r") as f:
            project_data = json.load(f)

        # Read story files if they exist
        stories = []
        if "stories" in project_data and project_data["stories"]:
            for story_name in project_data["stories"]:
                story_file = project_dir / f"{story_name}.json"
                if story_file.exists():
                    with open(story_file, "r") as f:
                        story_data = json.load(f)
                        stories.append(story_data)

        # Return project data with stories
        return {
            "success": True,
            "project": project_data,
            "stories": stories
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading project: {str(e)}")

class ChatMessage(BaseModel):
    id: str
    role: str
    content: str
    createdAt: str
    projectId: Optional[str] = None

class SaveChatRequest(BaseModel):
    projectId: str
    messages: List[ChatMessage]

class ChatRequestWithProject(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = []
    project_id: Optional[str] = None

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequestWithProject):
    """Send a message to the AI chatbot for storyboard assistance"""
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        # Convert dict conversation history to ChatMessage objects for chatbot service
        from app.services.chatbot import ChatMessage as ServiceChatMessage
        chat_history = []
        if request.conversation_history:
            for msg in request.conversation_history:
                chat_history.append(ServiceChatMessage(role=msg.get("role", "user"), content=msg.get("content", "")))

        ai_response = chatbot_service.generate_response(
            user_message=request.message,
            conversation_history=chat_history,
            project_id=request.project_id
        )

        return ChatResponse(message=ai_response, success=True)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.post("/api/chat/save")
async def save_chat_messages(request: SaveChatRequest):
    """Save chat messages for a project"""
    try:
        # Find project directory
        project_dir = Path(__file__).parent.parent.parent / "data" / f"project_{request.projectId}"
        if not project_dir.exists():
            raise HTTPException(status_code=404, detail="Project not found")

        # Save chat history to file
        chat_file = project_dir / "chat_history.json"

        # Convert messages to dict format
        messages_data = []
        for msg in request.messages:
            messages_data.append({
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "createdAt": msg.createdAt
            })

        # Save to file
        with open(chat_file, "w") as f:
            json.dump({
                "projectId": request.projectId,
                "messages": messages_data,
                "lastUpdated": datetime.now().isoformat()
            }, f, indent=2)

        return {"success": True, "message": "Chat history saved"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving chat history: {str(e)}")

@app.get("/api/chat/history/{project_id}")
async def get_chat_history(project_id: str):
    """Get chat history for a project"""
    try:
        # Find project directory
        project_dir = Path(__file__).parent.parent.parent / "data" / f"project_{project_id}"
        if not project_dir.exists():
            raise HTTPException(status_code=404, detail="Project not found")

        # Read chat history file
        chat_file = project_dir / "chat_history.json"

        if chat_file.exists():
            with open(chat_file, "r") as f:
                data = json.load(f)
                return {
                    "success": True,
                    "messages": data.get("messages", []),
                    "lastUpdated": data.get("lastUpdated")
                }
        else:
            # Return empty history if file doesn't exist
            return {
                "success": True,
                "messages": [],
                "lastUpdated": None
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading chat history: {str(e)}")