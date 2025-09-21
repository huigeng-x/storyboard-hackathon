from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.services.chatbot import StoryboardChatbot, ChatRequest, ChatResponse
from pydantic import BaseModel
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

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """Send a message to the AI chatbot for storyboard assistance"""
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        ai_response = chatbot_service.generate_response(
            user_message=request.message,
            conversation_history=request.conversation_history
        )

        return ChatResponse(message=ai_response, success=True)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")