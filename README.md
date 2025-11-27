# Task Manager Frontend

Modern React SPA for managing tasks with filtering, editing, and detailed views. The UI is built with Vite, Material UI, and custom contexts that talk to the backend REST API.

## Features

- Dashboard with search, status filters (All/To Do/In Progress/Completed), and live summary counts
- Task CRUD flows: add, edit, delete, and detail view with toast-based feedback
- Global TaskContext for data fetching, caching, and optimistic updates via `taskService`
- Dark/light theme toggle powered by a custom ThemeContext
- Responsive layouts built with Material UI and `TaskCard` components
- Configurable API base URL via `VITE_API_URL` for local or hosted backends

## Tech Stack

- React 19 + Vite 7
- Material UI 7 + Emotion for theming and styling
- React Context API for task and theme state
- React Toastify for user notifications

## Project Structure

```
task-manager-frontend/
├── public/            # Static assets
├── src/
│   ├── components/    # Dashboard, Add/Edit/View forms, TaskCard
│   ├── context/       # TaskContext (data) & ThemeContext (UI)
│   ├── services/      # REST client (fetch-based)
│   ├── App.jsx        # App shell + routing between views
│   └── main.jsx       # Vite entry point
├── package.json
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ (or the version required by Vite)
- pnpm / npm / yarn (examples below use npm)
- Running backend API (default: `https://task-manager-backend-aezg.onrender.com/api`)

### Installation

```bash
cd task-manager-frontend
npm install
```

### Environment Variables

Create `.env` in the project root if you need to point to a different backend:

```
VITE_API_URL=https://your-api-host/api
```

If the variable is omitted, the app falls back to the hosted Render URL in `src/services/api.js`.

### Available Scripts

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Create production build outputs in dist/
npm run preview  # Serve the production bundle locally
npm run lint     # Run ESLint checks
```

## API Expectations

The frontend expects a REST API with endpoints under `/tasks` supporting:

- `GET /tasks?search=&status=` – list + filtering
- `GET /tasks/:id` – fetch a single task
- `POST /tasks` – create task (title, description, dueDate, priority, status)
- `PUT /tasks/:id` – update task fields
- `DELETE /tasks/:id` – remove task

Adjust `taskService` if your backend uses different field names or routes.

## Deployment Notes

- Bundle via `npm run build`, then deploy the `dist/` folder to any static host (Vercel, Netlify, S3, etc.)
- Set `VITE_API_URL` in your deployment environment to point at the production backend

## Troubleshooting

- **CORS errors**: ensure the backend allows the frontend origin.
- **Failed to fetch tasks**: verify `VITE_API_URL` is correct and the backend is running.
- **Material UI styling issues**: clear browser cache or ensure only one MUI theme provider wraps the app.

Happy tasking! 🚀
