# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

Storyboard hackathon project with React frontend and FastAPI backend setup.

## Technology Stack

### Frontend
- React with Vite
- Located in `/frontend/`
- Port: 3000
- Start command: `npm run dev`

### Backend
- FastAPI with Python
- Located in `/backend/`
- Port: 8001
- Virtual environment: `venv/`
- Start command: `source venv/bin/activate && uvicorn app.main:app --reload --port 8001`

## Backend Configuration

### AG2 (AutoGen) Setup
- AG2 is installed and working
- Configuration stored in `backend/config/llm_config.json`
- Uses environment variables for API keys via `ENV:` prefix
- Config loader at `backend/config/config_loader.py` handles environment variable substitution

### Environment Variables
- Template: `backend/.env.example`
- Active file: `backend/.env` (gitignored)
- Required variables:
  - `OPENAI_API_KEY`
  - `GEMINI_API_KEY`

### API Endpoints
- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/test` - Test endpoint

## Development Commands

### Backend Setup
```bash
cd "backend"
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn python-dotenv autogen
uvicorn app.main:app --reload --port 8001
```

### Frontend Setup
```bash
cd "frontend"
npm install
npm run dev
```

## Development Notes

The working directory is `/Users/huigeng/storyboard hackathon/` - note the space in the directory name which may require proper quoting in commands.

## Configuration Usage

To use LLM configuration in backend code:
```python
from config.config_loader import get_llm_config

llm_config = get_llm_config()
```