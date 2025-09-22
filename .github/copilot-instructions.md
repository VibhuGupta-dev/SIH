# Copilot Instructions for HelloMind Codebase

## Big Picture Architecture
- **Three main services:**
  - `AgentService/` (Python Flask, Gemini AI integration): Handles AI agent logic and API endpoints.
  - `Backend/` (Node.js/Express, MongoDB): Manages authentication, user data, community, mental assessment, and sockets for real-time features.
  - `frontend/` (React + Vite): User-facing web app, communicates with backend via REST and sockets.
- **Data Flow:**
  - Frontend interacts with backend via REST endpoints and Socket.io for real-time features.
  - Backend connects to MongoDB and exposes APIs for auth, assessment, community, and motivational progress.
  - AgentService provides AI-powered endpoints (Gemini API) and is accessed via HTTP from frontend/backend.

## Developer Workflows
- **Frontend:**
  - Start dev server: `npm run dev` (in `frontend/`)
  - Build: `npm run build`
  - Lint: `npm run lint`
  - Preview: `npm run preview`
- **Backend:**
  - Start dev server: `npm run dev` (in `Backend/`)
  - Uses `nodemon` for hot-reloading.
- **AgentService:**
  - Run Flask app: `python app.py` (ensure dependencies from `requirements.txt` are installed)

## Project-Specific Conventions
- **Frontend:**
  - Uses React functional components, Tailwind CSS, Framer Motion for animation.
  - Component and file naming should use `PascalCase` (e.g., `NavBar.jsx` in `components/`).
  - All imports must match the actual file/folder casing (Windows is case-insensitive, but keep consistent for cross-platform compatibility).
  - Floating UI elements and animated backgrounds are common (see `FloatingButton.jsx`, `NavBar.jsx`).
- **Backend:**
  - Organized by feature: `controller/`, `models/`, `routes/`, `middleware/`, `utils/`.
  - Uses JWT for authentication, Mongoose for MongoDB models.
  - Socket.io setup in `index.js` for real-time features.
- **AgentService:**
  - Uses Flask, CORS, rate limiting, and Gemini API integration.
  - API key for Gemini must be set in environment variables.

## Integration Points & Patterns
- **Frontend <-> Backend:**
  - REST API calls use `axios` with `withCredentials: true` for auth.
  - Socket.io used for real-time chat and notifications.
- **Backend <-> AgentService:**
  - HTTP requests to AI endpoints (Gemini).
- **Frontend <-> AgentService:**
  - Direct API calls for AI-powered features (if exposed).

## Key Files & Directories
- `frontend/src/components/NavBar.jsx`, `FloatingButton.jsx`: UI/UX patterns.
- `Backend/index.js`: Express app, socket setup, middleware.
- `Backend/routes/`, `controller/`, `models/`: Feature boundaries.
- `AgentService/app.py`: Flask app, Gemini API integration.

## Example Patterns
- **Consistent import casing:** Always use `import Navbar from "../components/NavBar"` (not `../Components/Navbar`).
- **Animated UI:** Use Framer Motion and Tailwind for interactive elements.
- **API calls:**
  ```js
  axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, { ... }, { withCredentials: true })
  ```
- **Socket.io setup:** See `Backend/index.js` for server and CORS config.

## External Dependencies
- **Frontend:** React, Vite, Tailwind, Framer Motion, Socket.io-client, axios.
- **Backend:** Express, Mongoose, JWT, Socket.io, Nodemailer, Joi, LangChain, EmailJS.
- **AgentService:** Flask, Gemini API, Flask-Limiter, cachetools.

---

If any conventions or workflows are unclear, please ask for clarification or provide feedback to improve these instructions.
