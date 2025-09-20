# Storyboard Hackathon Project

## Project Structure
```
storyboard hackathon/
├── frontend/          # React frontend application
├── backend/           # FastAPI backend server
└── README.md         # This file
```

## Prerequisites
- Node.js and npm (for frontend)
- Python 3.x (for backend)

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Create and activate virtual environment
```bash
python3 -m venv venv
source venv/bin/activate  # On macOS/Linux
```

### 3. Install dependencies
```bash
pip install fastapi uvicorn
```

### 4. Run the backend server
```bash
uvicorn app.main:app --reload --port 8001
```

The backend API will be available at `http://localhost:8001`

### Available Backend Endpoints
- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/test` - Test endpoint

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Running Both Services

To run both frontend and backend simultaneously, open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd "storyboard hackathon/backend"
source venv/bin/activate
uvicorn app.main:app --reload --port 8001
```

**Terminal 2 - Frontend:**
```bash
cd "storyboard hackathon/frontend"
npm run dev
```

## Notes
- The frontend is configured to proxy API requests to the backend (port 8001)
- Both servers run with hot-reload enabled for development
- Make sure port 3000 (frontend) and 8001 (backend) are available