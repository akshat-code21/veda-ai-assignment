# VedaAI – AI Assessment Creator

An AI-powered assessment platform that lets teachers create assignments, generate structured question papers using LLMs, and view/download the output as formatted PDFs — all in real time.

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Cloud-DC382D?logo=redis&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-Queue-FF6600)

---

## Features

- **Assignment Creation** — Form with title, subject, due date, question types (MCQ, short, long, true/false), configurable question counts & marks, file upload (PDF/text), and additional instructions
- **Zod Validation** — Frontend form validated with Zod schemas; no empty or negative values allowed
- **AI Question Generation** — Structured prompts sent to OpenAI; output validated with Zod schemas into sections with difficulty tags
- **PDF Generation** — Server-side PDF creation with PDFKit (Inter font, student info section, sections, difficulty badges, answer key)
- **Real-Time Updates** — WebSocket notifications push status changes (pending → processing → completed/failed) to the frontend instantly
- **Background Processing** — BullMQ job queue with Redis for async generation; 3 retry attempts with exponential backoff
- **Authentication** — Better Auth with email/password; session cookies; protected + public-only route guards
- **File Upload** — Multer → AWS S3 pipeline with presigned URL downloads
- **PDF Viewer** — In-browser PDF rendering with `@embedpdf/react-pdf-viewer`; download & regenerate buttons
- **Mobile Responsive** — Fully responsive UI with separate mobile/desktop layouts

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (Next.js 16 + App Router + Tailwind + Shadcn)     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐    │
│  │  Login/  │  │Dashboard │  │ Create   │  │  Output   │    │
│  │ Register │  │  (List)  │  │Assignment│  │  (PDF)    │    │
│  └──────────┘  └──────────┘  └──────────┘  └───────────┘    │
│       ↕ Axios + Cookies          ↕ WebSocket                │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend (Node.js + Express + TypeScript)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐    │
│  │  Better  │  │  REST    │  │  BullMQ  │  │ WebSocket │    │
│  │  Auth    │  │  API     │  │  Queue   │  │  Server   │    │
│  └──────────┘  └──────────┘  └──────────┘  └───────────┘    │
│       │              │              │              │        │
│       ▼              ▼              ▼              │        │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │          │
│  │ MongoDB  │  │ AWS S3   │  │  Worker      │    │          │
│  │ Atlas    │  │ (files)  │  │  ├─ LLM Call  │───┘          │
│  └──────────┘  └──────────┘  │  ├─ PDF Gen   │              │
│                              │  └─ S3 Upload │              │
│                              └──────────────┘               │
│                                     │                       │
│                              ┌──────────┐                   │
│                              │  Redis   │                   │
│                              │ (Queue)  │                   │
│                              └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. Teacher submits assignment form → `POST /api/assignments` (multipart)
2. Backend uploads file to S3 (if attached), saves assignment to MongoDB (status: `pending`)
3. BullMQ job enqueued → WebSocket broadcasts `assignment:processing`
4. Worker calls OpenAI → validates JSON with Zod → generates PDF with PDFKit → uploads to S3
5. Assignment updated (status: `completed`, `pdfUrl` set) → WebSocket broadcasts `assignment:completed`
6. Frontend receives WebSocket event → invalidates React Query cache → refetches → renders PDF

---

## Approach

### Frontend (Next.js 16 + App Router)

- **Routes**: Organized into `(auth)` and `(dashboard)` route groups. The dashboard layout wraps all authenticated pages with `AuthGuard`, sidebar, topbar, and bottom nav.
- **State Management**: Dual-layer approach — **TanStack React Query** handles server state (assignments list, single assignment) with automatic caching and background refetching, while **Zustand** provides lightweight client state (active assignment, sidebar counter) for instant UI updates without server roundtrips.
- **Authentication**: Better Auth client-side SDK handles login/register/social auth. API calls use `credentials: "include"` for cross-origin cookie-based sessions. The `proxy.ts` (Next.js 16 middleware) only handles the root `/` → `/assignments` redirect; actual auth protection is delegated to the client-side `AuthGuard` component which calls the backend's session API.
- **Real-Time Updates**: A `useWebSocket` hook connects to the backend's WebSocket server when an assignment is processing. On receiving `assignment:completed`/`assignment:failed` events, it invalidates the React Query cache and updates the Zustand store, triggering seamless UI transitions from the loading state to the PDF viewer.
- **PDF Viewer**: `@embedpdf/react-pdf-viewer` is dynamically imported with `ssr: false` to avoid server-side rendering conflicts. The viewer is configured with `ZoomMode.FitWidth` and disabled annotation/edit toolbars for a read-only experience.
- **Caching**: React Query configured with 5-minute stale time, 30-minute garbage collection, and 2 retry attempts. The assignments list is invalidated on creation and deletion to keep the sidebar counter in sync.

### Backend (Express + BullMQ + OpenAI)

- **API Design**: RESTful endpoints for CRUD operations on assignments. File uploads are handled via Multer and stored on AWS S3 with presigned URL generation for downloads.
- **Background Processing**: Assignment generation is dequeued via BullMQ (Redis-backed). The worker calls OpenAI's chat completions API with a structured prompt that defines the JSON schema, question distribution, and difficulty levels. The LLM output is validated against a Zod schema before PDF generation.
- **PDF Generation**: PDFKit generates the final question paper with Inter font, sections, difficulty badges, and answer key. The PDF is uploaded to S3 and the assignment record is updated with the public URL.
- **WebSocket**: A dedicated WebSocket server broadcasts status changes (`pending` → `processing` → `completed`/`failed`) to connected clients, filtered by `assignmentId`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Shadcn/UI |
| **State** | Zustand, TanStack React Query |
| **Auth** | Better Auth (email/password, session cookies) |
| **Validation** | Zod (frontend forms + LLM output parsing) |
| **Backend** | Node.js, Express 5, TypeScript, Bun runtime |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Cache/Queue** | Redis (IORedis) + BullMQ |
| **AI** | OpenAI |
| **Storage** | AWS S3 (file uploads + generated PDFs) |
| **PDF** | PDFKit (server-side generation) |
| **WebSocket** | `ws` library (real-time status updates) |
| **Notifications** | Sonner (toast notifications) |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.1+)
- [Docker](https://docker.com/) (for local Redis) — or a Redis Cloud account
- MongoDB Atlas cluster
- AWS S3 bucket
- OpenAI API key

### 1. Clone the repo

```bash
git clone https://github.com/your-username/veda-ai.git
cd veda-ai
```

### 2. Start Redis (local)

```bash
docker run -d --name veda-redis -p 6379:6379 redis:7-alpine
```

### 3. Backend setup

```bash
cd backend
bun install
```

Create `backend/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<db>
BETTER_AUTH_SECRET=<openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

REDIS_URL=redis://localhost:6379

OPENAI_API_KEY=sk-proj-...

AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-south-1
S3_BUCKET_NAME=veda-ai-uploads
```

Start the dev server:

```bash
bun run dev
# Server starts on http://localhost:3000
```

### 4. Frontend setup (Next.js)

```bash
cd next-frontend
bun install
```

Create `next-frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

Start the dev server:

```bash
bun run dev
# App starts on http://localhost:5173
```

### 5. Use the app

1. Open `http://localhost:5173` → Register a new account
2. Create an assignment (fill in title, subject, due date, question types)
3. Wait for the AI to generate your question paper (real-time status via WebSocket)
4. View the generated PDF, download it, or regenerate

---

## Project Structure

```
veda-ai/
├── next-frontend/            # Next.js 16 (App Router)
│   └── app/
│       ├── (auth)/           # Login, Register routes
│       ├── (dashboard)/      # Dashboard layout + sub-routes
│       └── layout.tsx        # Root layout (providers, fonts)
│   ├── components/           # UI components (Sidebar, TopBar, FilledState, etc.)
│   ├── lib/                  # API client, auth client, utilities
│   ├── store/                # Zustand store (assignment state)
│   ├── hooks/                # Custom hooks (WebSocket)
│   ├── types/                # TypeScript types
│   ├── providers/            # React Query provider
│   └── proxy.ts              # Next.js 16 middleware (auth guard)
│
├── frontend/                 # Original Vite app (archived)
│
├── backend/
│   └── src/
│       ├── config/           # DB, Redis, S3, env validation
│       ├── lib/              # Better Auth instance
│       ├── middleware/       # Auth guard, Multer file upload
│       ├── models/           # Mongoose schemas
│       ├── routes/           # Express REST endpoints
│       ├── queues/           # BullMQ queue definition
│       ├── workers/          # Background job processor
│       ├── services/         # LLM, PDF generation, S3
│       └── websocket/        # WebSocket server + broadcast
│
└── instructions.md           # Assignment brief
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/assignments` | Create assignment (multipart form + optional file) |
| `GET` | `/api/assignments` | List all assignments for current user |
| `GET` | `/api/assignments/:id` | Get single assignment with generated paper |
| `POST` | `/api/assignments/:id/regenerate` | Re-enqueue generation job |
| `*` | `/api/auth/*` | Better Auth endpoints (sign-in, sign-up, sign-out, session) |

---
