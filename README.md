**SkillMate AI**

**AI-Powered Voice Interview Practice Platform**

SkillMate AI is a full-stack AI-powered interview practice platform designed to simulate real interview experiences through voice-based interaction, adaptive questioning, resume-driven interviews, and AI-powered performance analysis.
The platform helps candidates practice interviews, receive dynamically generated questions, and obtain structured feedback to identify areas for improvement.


**Key Features**

1. Voice-Based Interviews – Real-time voice interaction during interview sessions.
2. AI Interviewer – Dynamically generates questions based on the candidate's profile.
3. Resume-Based Interviews – Uses uploaded resumes to personalize interview questions.
4. Real-Time Communication – Socket-based communication for interactive interview sessions.
5. AI-Powered Feedback – Generates structured performance analysis after each interview.
6. Secure Authentication – JWT-based authentication and protected routes.
7. Performance Reports – Provides insights into strengths and areas for improvement.
8. Dockerized Application – Containerized frontend and backend for consistent deployment.
9. CI/CD – Automated workflows using GitHub Actions.

**Architecture**

                  **┌─────────────────────┐
                    │      React UI       │
                    │  Interview / Voice  │
                    └──────────┬──────────┘
                               │
                     REST / Socket.io
                               │
                    ┌──────────▼──────────┐
                    │   Node.js Backend   │
                    │      Express        │
                    └───────┬─────┬───────┘
                            │     │
                  ┌─────────┘     └──────────┐
                  ▼                          ▼
          ┌───────────────┐          ┌───────────────┐
          │   PostgreSQL  │          │   Gemini AI   │
          │    + Prisma   │          │ AI Interview  │
          └───────────────┘          └───────────────┘**
**Tech Stack**

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Zustand, Socket.io Client, Recharts
**Backend:** Node.js, Express, TypeScript, Socket.io, JWT, Prisma
**AI & Processing:** Google Gemini API, PDF Resume Parsing, AI Question Generation, AI Feedback Analysis
**Database:** PostgreSQL
**DevOps:** Docker, Docker Compose, GitHub Actions, CI/CD

**Interview Workflow**

  **User Registration / Login 
            ↓ 
      Resume Upload 
            ↓ 
    Resume Processing 
            ↓ 
    Interview Configuration
            ↓ 
  AI Question Generation 
            ↓
  Voice-Based Interview 
            ↓ 
Real-Time Interview Session 
            ↓ 
  Interview Completion 
            ↓ 
  AI Performance Analysis 
            ↓ 
Feedback & Performance Report**

**Getting Started**

Prerequisites

Node.js
pnpm
PostgreSQL
Docker
Google Gemini API Key

Clone Repository

Git clone:  https://github.com/lekshmyrajesh998/skillmate-ai.git
cd skillmate-ai
Run with Docker
docker compose up --build

Frontend: http://localhost:5173

Backend: http://localhost:4000

**Environment Variables**

DATABASE_URL=
JWT_SECRET=
GEMINI_API_KEY=

**Important :** Do not commit sensitive credentials or .env files to the repository.

**Project Highlights**

1. Full-stack AI application architecture
2. Real-time client-server communication
3. Resume-driven interview personalization
4. Voice-enabled interview workflow
5. Secure authentication and authorization
6. AI-based performance evaluation
7. Containerized application environment
8. Automated CI/CD pipeline

