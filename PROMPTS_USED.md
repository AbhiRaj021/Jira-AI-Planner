# Prompts Used 📝

This document records the key prompts and instructions used during the development of the Jira AI Planner.

## 🏗️ State Management & Refactoring

> "Refactor the entire application's state management to use Zustand. Create separate stores for Plan-related data and System status. Eliminate all direct API calls from components and move them into store actions."

> "Clean up the Home page by removing local `useState` for form data and using the `usePlanStore` hook. Ensure the project history and plan generation flows are fully centralized."

## 🎨 UI & Aesthetics

> "Create a premium, glassmorphism-based UI for a feature planning dashboard. Use a zinc/blue color palette, dark mode support by default, and smooth Framer Motion animations for all transitions."

> "Refactor the Kanban task board to support drag-and-drop between columns (Frontend, Backend, Database) using `@dnd-kit`. Ensure the state update is performed immutably within the Zustand store."

## 🤖 AI Integration & Logic

> "Develop a specialized prompt for a Senior Software Architect agent that outputs a structured implementation plan in valid JSON format. Include sections for goals, user stories, and technical tasks across the stack."

> "Implement a robust JSON parser for the AI response. Include regex-based sanitization to handle trailing commas, unescaped quotes, or conversational text appended by the LLM."

## 🛠️ Debugging & Polish

> "Fix the issue where `framer-motion` triggers a server-side error in Next.js App Router. Ensure the correct Client/Server component boundaries are established with the `'use client';` directive."

> "Resolve the crash occurring during the 'Build New' transition by stabilizing the component lifecycle and ensuring data persistence during exit animations."
