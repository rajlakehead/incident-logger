# Incident Logging and Summarization Tool

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## 🎯 Take-Home Assignment – Fallyx

**Objective:**  
Build a lightweight incident logging and summarization tool for a fictional senior care home.

✅ **All core requirements are fully implemented**, including:

- Firebase Authentication (Google sign-in)
- REST API to log and view incidents
- OpenAI-powered summarization of incidents
- PostgreSQL database with Sequelize ORM
- Unit testing using Jest
- Clean, minimal frontend in Next.js + Tailwind CSS

---

## Features

### Backend (Node.js + Express + TypeScript)

- **Auth Middleware**: Verifies Firebase JWT tokens
- **Incident Model**:
  - `id`, `userId`, `type`, `description`, `summary`, `createdAt`, `updatedAt`
- **API Endpoints**:
  - `POST /incidents` – Create new incident (auth required)
  - `GET /incidents` – List incidents of authenticated user (auth required)
  - `POST /incidents/:id/summarize` – Summarize incident using OpenAI (auth required)

### Frontend (Next.js + React 19 + Tailwind CSS)

- Login with Firebase (Google)
- Submit incident form
- View list of submitted incidents with summaries

---

# Create a .env file in backend/ with:
env
Copy
Edit
  - PORT=4000
  - DATABASE_URL=postgres://<username>:<password>@localhost:5432/<database_name>
  - FIREBASE_PROJECT_ID=your_project_id
  - FIREBASE_CLIENT_EMAIL=your_service_account_email
  - FIREBASE_PRIVATE_KEY="your_service_account_private_key"
  - OPENAI_API_KEY=your_openai_key

## Getting Started

First, run the development server:

bash
npm run dev
 or
yarn dev
 or
pnpm dev
 or 
bun dev


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
