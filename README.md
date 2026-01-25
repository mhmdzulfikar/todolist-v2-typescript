# 🚀 Fullstack Productivity Hub

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Stack](https://img.shields.io/badge/stack-PERN-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)


## 🧠 System Design & Logic Flow

I believe that writing code is the last step of engineering. Before typing a single line of code, I mapped out the entire system architecture to ensure scalability and efficiency.

Here is the blueprint of the application's data flow, including Authentication logic, MVC structure, and Database relationships:

<img width="1541" height="841" alt="Screenshot 2026-01-15 191641" src="https://github.com/user-attachments/assets/745f6ffc-2581-432c-bd8b-af0c25733be2" />


---
<img width="1541" height="841" alt="image" src="https://github.com/user-attachments/assets/c4267518-63ae-42b2-b383-10ea62cb1712" />

*(Click image to view in full size)*

## 📖 Overview

**Fullstack Productivity Hub** is a comprehensive web application designed to streamline daily tasks and boost efficiency. Built using the **PERN Stack** (PostgreSQL, Express, React, Node.js), this application integrates task management, note-taking, code snippet storage, and productivity analytics into a single, cohesive interface.

This project demonstrates a robust implementation of **MVC Architecture**, secure **JWT Authentication**, and responsive **UI/UX design**.

---

## ✨ Key Features

### 🔐 Authentication & Security
* **Secure Registration & Login:** Password hashing using `bcryptjs`.
* **JWT Authorization:** Protected routes using Middleware to verify `access_tokens`.
* **Session Management:** Auto-attach tokens via Axios Interceptors for seamless UX.

### 📝 Task & Data Management
* **Kanban/ToDo List:** Drag and drop functionality using `@dnd-kit`.
* **Snippet Library:** Store and retrieve code snippets with syntax highlighting.
* **Note Pad:** Rich text notes for quick ideas.
* **CRUD Operations:** Full Create, Read, Update, Delete capabilities across all features.

### 📊 Productivity Tools
* **Pomodoro Timer:** Integrated focus timer.
* **Analytics Dashboard:** Visual productivity charts using `recharts` and `date-fns`.
* **AI Chat:** (Beta) Integrated AI assistant for quick help.

### 🎨 UI/UX
* **Modern Design:** Built with **Tailwind CSS**.
* **Interactive Animations:** Smooth transitions using **GSAP**.
* **Responsive Layout:** Fully functional on desktop and mobile devices.

---

## 🛠️ Tech Stack

### Frontend (Client-Side)
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS
* **State Management:** React Context API
* **HTTP Client:** Axios (with Interceptors)
* **Visuals:** Recharts, React Icons, GSAP
* **Utilities:** @dnd-kit, date-fns

### Backend (Server-Side)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL
* **ORM:** Sequelize
* **Security:** JSON Web Token (JWT), Bcryptjs, CORS

---

## 🏗️ System Architecture

This project follows the **MVC (Model-View-Controller)** pattern to ensure code maintainability and separation of concerns.

### 1. Data Flow
1.  **Client (React):** User initiates an action (e.g., "Save Snippet").
2.  **Route:** The request hits the specific API endpoint.
3.  **Middleware (The Gatekeeper):** Validates the `Authorization: Bearer <token>` header. If invalid, the request is rejected immediately.
4.  **Controller (The Manager):** Processes the business logic. It extracts the `userId` from the decoded token (preventing identity spoofing) and validates input.
5.  **Model (The Blueprint):** Sequelize defines the schema (e.g., `DataTypes.TEXT` for long code snippets) and ensures data integrity (e.g., `allowNull: false`).
6.  **Database:** Data is persisted in PostgreSQL.

### 2. Security Highlights
* **Identity Integrity:** User IDs are never taken from the request body manually. They are extracted strictly from the validated JWT token (`req.user.userId`).
* **Database Hygiene:** `freezeTableName: true` is used in models to maintain strict naming conventions.

---

## 📂 Project Structure

```bash
project-todolist/
├── backend/                # Server-side logic
│   ├── config/             # Database connection (Sequelize)
│   ├── controllers/        # Business logic (ToDo, Notes, Auth)
│   ├── middleware/         # Auth verification (JWT)
│   ├── models/             # Database schemas
│   ├── routes/             # API Endpoints
│   └── server.js           # Entry point
│
├── frontend/               # Client-side application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Cards, Navbar)
│   │   ├── context/        # Global state management
│   │   ├── hooks/          # Custom hooks (useFetch, useTodo)
│   │   ├── pages/          # Full page views (Dashboard, Login)
│   │   └── services/       # API integration logic
│   └── vite.config.js
└── README.md
