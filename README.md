# Jira AI Planner 🚀

A high-performance, AI-driven project planning and implementation tool. It helps engineering teams transform high-level feature ideas into detailed, actionable implementation plans in seconds.

## ✨ Features

- **🧠 Intelligent Planning**: Leverages Llama 3.1 8B (via SambaNova) to generate feature specs, user stories, and technical tasks.
- **📋 Kanban Task Board**: Fully interactive drag-and-drop board to manage Frontend, Backend, and Database tasks using `@dnd-kit`.
- **🗂️ History & Persistence**: Automatically saves every generated plan to MongoDB for future reference.
- **⚡ Zustand State Management**: Centralized, predictable state management for professional-grade reliability.
- **📤 Export Capabilities**: Instant Markdown export (copy or download) for seamless Jira or documentation integration.
- **🏥 System Telemetry**: Real-time health monitoring for Backend, Database, and AI connectivity.
- **🎨 Premium UI/UX**: Stunning glassmorphism design, dark mode support, and fluid animations powered by Framer Motion.

## 📂 Project Structure

```text
jiraaiplanner/
├── app/                 # Next.js App Router (Pages & API)
│   ├── api/             # Backend endpoints (Generate, Specs, Status)
│   ├── status/          # System health page
│   └── globals.css      # Core Design System
├── components/          # React Components
│   ├── history/         # Project history sidebar/list
│   ├── plan-viewer/     # Kanban board & Header
│   ├── shared/          # Reusable animations & messages
│   ├── status/          # Health check cards
│   └── ui/              # Base Atomic Components (Button, Input, etc)
├── lib/                 # Core Infrastructure
│   ├── ai/              # SambaNova/Llama integration & Logic
│   └── db/              # MongoDB connection & schemas
├── models/              # Mongoose Data Models
├── store/               # Zustand Global State (Plan & System stores)
├── types/               # TypeScript interfaces (Plan, Task)
└── public/              # Static assets
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (Local or Atlas)
- SambaNova API Key

### Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file in the root:
   ```env
   SAMBANOVA_API_KEY=your_key_here
   MONGODB_URI=your_mongodb_uri
   ```

3. **Run Development Mode**:
   ```bash
   npm run dev
   ```

## 🏗️ Technical Decisions

- **State Management**: Zustand was chosen for its simplicity and performance compared to Redux, enabling flawless DnD state transitions.
- **AI Provider**: SambaNova was selected for high-speed inference of Llama 3.1 8B, ensuring plans are generated in under 5 seconds.
- **UI Architecture**: Used a component-based architecture with separate stores for UI state and System state to ensure separation of concerns.

---
Built with ❤️ by Aiviraj Rajput
