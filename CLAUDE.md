# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

**AI-Powered Storyboard Generator** - A fully functional storyboard creation platform with AI integration, chat assistance, project management, and image search capabilities.

## Technology Stack

### Frontend
- **React 18** with TypeScript and Vite
- **Tailwind CSS v4** with modern styling
- **Radix UI** components for accessibility
- **React Router** for dynamic project routing
- Located in `/frontend/`
- Port: 3000
- Start command: `npm run dev`

### Backend
- **FastAPI** with Python 3.x
- **Langflow** integration for AI storyboard generation
- **Google Custom Search API** for image search
- **Pydantic** for data validation
- Located in `/backend/`
- Port: 8001
- Virtual environment: `venv/`
- Start command: `source venv/bin/activate && uvicorn app.main:app --reload --port 8001`

## Current Features

### ✅ Implemented Features
- **AI Storyboard Generation**: Langflow integration with 6+ minute timeout handling
- **Project Management**: Create, store, and load projects with unique IDs
- **Dynamic Routing**: `/storyboard/{project_id}` URLs for direct project access
- **Persistent Chat History**: Chat conversations saved per project
- **Interactive Chat Assistant**: Real-time AI assistance with quick actions
- **Google Image Search**: Smart image search with JPEG filtering and longest title selection
- **Storyboard Editor**: Visual panel grid with type-specific icons and badges
- **Data Persistence**: Organized file structure in `data/project_{id}/` folders
- **Error Handling**: Comprehensive error handling and fallbacks
- **Responsive UI**: Modern, accessible interface with loading states

### 🎯 Application Flow
1. **Onboarding**: User selects storyboard type and provides description
2. **AI Generation**: Langflow processes request and generates structured storyboard
3. **Project Creation**: Files saved to organized folder structure
4. **Interactive Editing**: Chat assistant helps refine and improve storyboard
5. **Persistence**: All data (project, stories, chat history) automatically saved

## Environment Variables

### Required Variables (backend/.env)
```env
# AI Configuration
OPENAI_API_KEY=sk-proj-...                    # OpenAI API key
GEMINI_API_KEY=AIzaSyC...                     # Google Gemini API key

# Langflow Configuration
LANGFLOW_API_KEY=sk-dhT...                    # Langflow service API key
LANGFLOW_HOST=localhost:7860                  # Langflow instance host
LANGFLOW_FLOW_ID=fdb1e893-40e2-476f-8fcd-... # Specific flow ID

# Google Search Configuration
GOOGLE_CSE_API_KEY=AIzaSyD...                 # Google Custom Search API key
SEARCH_ENGINE_ID=671cee53cd6cd429c            # Custom Search Engine ID
```

## API Endpoints

### Core Application
- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/test` - Test endpoint

### Project Management
- `POST /api/create-project` - Create new storyboard project
- `GET /api/project/{project_id}` - Get project data and individual stories

### AI Chat & Storyboard Generation
- `POST /api/chat` - Send message to AI chatbot (supports project_id)
- `POST /api/chat/save` - Save chat message history
- `GET /api/chat/history/{project_id}` - Retrieve chat history for project

### Image Search
- `POST /api/search/images` - Search images with filters (size, type, safety)
- `GET /api/search/image?query={query}` - Get single best image result

## Data Structure

### Project Organization
```
data/
└── project_{timestamp_id}/
    ├── project_type{n}.json     # Project metadata and storyboard data
    ├── story_{screen_name}.json # Individual story panel data
    └── chat_history.json        # Complete conversation history
```

### Key Models
- **Project**: ID, type, user input, creation time, stories list
- **Story**: Screen name, title, type, description, duration, notes
- **Chat Message**: ID, role, content, timestamp

## Component Architecture

### Frontend Components
- `OnboardingPage.tsx` - Project creation with 3 storyboard types
- `StoryboardLayout.tsx` - Main layout with project loading and routing
- `StoryboardEditor.tsx` - Grid of story panels with mock data fallback
- `EnhancedChatbot.tsx` - AI chat with history loading and auto-save
- `ChatMessage.tsx` - Individual message rendering
- `StoryboardPanel.tsx` - Individual story panel with type-specific styling
- `StoryboardHeader.tsx` - Project title and metadata display

### Backend Services
- `chatbot.py` - Langflow integration with JSON validation and file storage
- `image_search.py` - Google Custom Search API with helper utilities
- `main.py` - FastAPI application with all endpoints

## Development Commands

### Backend Setup
```bash
cd "storyboard hackathon/backend"
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn python-dotenv requests pydantic
uvicorn app.main:app --reload --port 8001
```

### Frontend Setup
```bash
cd "storyboard hackathon/frontend"
npm install
npm run dev
```

## Development Notes

### Important Considerations
- **Working Directory**: `/Users/huigeng/storyboard hackathon/` (contains space - use quotes)
- **Timeout Handling**: Langflow requests use 6+ minute timeouts due to processing time
- **File Persistence**: All data automatically saved to organized folder structure
- **Error Resilience**: Comprehensive fallbacks for API failures and missing data
- **TypeScript**: Full type safety with proper interfaces and validation

### Key Integrations
- **Langflow**: AI storyboard generation with automatic JSON processing
- **Google APIs**: Custom Search for intelligent image selection
- **Session Storage**: Project context maintained across browser sessions
- **React Router**: Dynamic URLs for direct project access

### Debugging Tools
- `debug_google_api.py` - Comprehensive Google API debugging
- `quick_test_api.py` - Fast API connectivity testing
- Console logging for API responses and error tracking

## Utility Functions

### Image Search Utilities
```python
# Class method for search + filtering
searcher.get_longest_title_jpeg_link(query, num_results=3)

# Standalone helper for existing results
get_longest_title_image_link(image_results)
```

### Chat History Management
- Automatic saving with 1-second debounce
- Project-specific history loading
- Fallback to onboarding context if no history exists

## Configuration Usage

### Backend Development
```python
from app.utils import GoogleImageSearch, get_longest_title_image_link
from app.services.chatbot import StoryboardChatbot

# Image search with smart filtering
searcher = GoogleImageSearch()
best_image_url = searcher.get_longest_title_jpeg_link("sunset beach")

# AI chat with project context
chatbot = StoryboardChatbot()
response = chatbot.generate_response(message, history, project_id)
```

### Frontend Development
```typescript
// Dynamic project routing
navigate(`/storyboard/${projectId}`);

// API calls with project context
fetch("/api/chat", {
  method: "POST",
  body: JSON.stringify({
    message: userInput,
    conversation_history: messages,
    project_id: projectId
  })
});
```