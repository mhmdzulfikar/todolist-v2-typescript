# Fullstack Productivity Hub

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Stack](https://img.shields.io/badge/stack-PERN-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Fullstack Productivity Hub** is a comprehensive web application designed to streamline daily tasks and boost efficiency. Built using the **PERN Stack** (PostgreSQL, Express, React, Node.js), this application integrates task management, note-taking, code snippet storage, and productivity analytics into a single, cohesive interface.


## System Design & Architecture

> *"I believe that writing code is the last step of engineering. Before typing a single line of code, I mapped out the entire system architecture to ensure scalability and efficiency."*

Below is the blueprint of the application's data flow, including Authentication logic, MVC structure, and Database relationships.

### Architectural Blueprint
<img width="100%" alt="System Design" src="https://github.com/user-attachments/assets/745f6ffc-2581-432c-bd8b-af0c25733be2" />

<details>
<summary><b>Click to view Database Schema Relationship</b></summary>
<br>
<img width="100%" alt="Database Schema" src="https://github.com/user-attachments/assets/c4267518-63ae-42b2-b383-10ea62cb1712" />
</details>



## Data Flow & Logic

To ensure data integrity and predictable state management, this project follows a strict **Unidirectional Data Flow**.

### 1. Request-Response Cycle (Sequence Diagram)
This diagram illustrates the "Round Trip" of data when a user adds a new task.

```mermaid
sequenceDiagram
    participant User as  User
    participant UI as  TodoList UI
    participant Hook as  useTodos (Hook)
    participant API as  todoService
    participant Server as  Backend & DB

    Note over User, UI: PHASE 1: REQUEST (User Action)
    User->>UI: Types "Learn Go" & Hits Enter
    UI->>Hook: Calls addTask("Learn Go")
    Hook->>API: Calls todoService.create(...)
    API->>Server: POST /todos (Request via Axios)
    
    Note over Server: Server Validates & Saves to DB...

    Note over User, UI: PHASE 2: RESPONSE (Optimistic/Real Update)
    Server-->>API: Return JSON {id: 1, task: "Learn Go"}
    API-->>Hook: Return New Data Object
    Hook->>Hook: setTasks([...prev, newData])
    Hook-->>UI: State Updates -> RE-RENDER
    UI-->>User: New Task Appears on Screen

```

### 2. Architectural Layers (Flowchart)

How the Frontend (React) communicates with the Backend (Express/Postgres).

```mermaid
graph TD
    subgraph Frontend [FRONTEND REACT]
        A[ User Action] -->|1. Submit Form| B(TodoList.tsx)
        B -->|2. Invoke Logic| C{useTodos Hook}
        C -->|3. Request API| D[todoService.ts]
        
        %% Response Path
        D -->|6. Return Data| C
        C -->|7. Update State| C
        C -->|8. Re-render UI| B
    end

    subgraph Backend [BACKEND SYSTEM]
        D -->|4. HTTP Request| E[Express Server]
        E -->|5. Query DB| F[(PostgreSQL)]
    end

```

---

##  Key Features

###  Authentication & Security

* **Secure Registration & Login:** Password hashing using `bcryptjs`.
* **JWT Authorization:** Protected routes using Middleware to verify `access_tokens`.
* **Session Management:** Auto-attach tokens via Axios Interceptors for seamless UX.

###  Task & Data Management

* **Kanban/ToDo List:** Drag and drop functionality using `@dnd-kit`.
* **Snippet Library:** Store and retrieve code snippets with syntax highlighting.
* **Note Pad:** Rich text notes for quick ideas.
* **CRUD Operations:** Full Create, Read, Update, Delete capabilities across all features.

###  Productivity Tools

* **Pomodoro Timer:** Integrated focus timer.
* **Analytics Dashboard:** Visual productivity charts using `recharts` and `date-fns`.

###  UI/UX

* **Modern Design:** Built with **Tailwind CSS**.
* **Interactive Animations:** Smooth transitions using **GSAP**.
* **Responsive Layout:** Fully functional on desktop and mobile devices.

---

##  Tech Stack

| Area | Technologies |
| --- | --- |
| **Frontend** | React.js (Vite), Tailwind CSS, React Context API, GSAP, Recharts |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL, Sequelize ORM |
| **Security** | JWT (JSON Web Token), Bcryptjs |
| **Utilities** | Axios (Interceptors), date-fns, @dnd-kit |

---

##  MVC Implementation

This project follows the **MVC (Model-View-Controller)** pattern to ensure code maintainability and separation of concerns.

1. **Middleware (The Gatekeeper):** Validates the `Authorization: Bearer <token>` header. If invalid, the request is rejected immediately.
2. **Controller (The Manager):** Processes the business logic. It extracts the `userId` from the decoded token (preventing identity spoofing) and validates input.
3. **Model (The Blueprint):** Sequelize defines the schema (e.g., `DataTypes.TEXT`) and ensures data integrity.

> **Security Highlight:** User IDs are never taken from the request body manually. They are extracted strictly from the validated JWT token (`req.user.userId`).

---

##  Project Structure

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
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global state management
│   │   ├── hooks/          # Custom hooks (useFetch, useTodos)
│   │   ├── pages/          # Full page views
│   │   ├── services/       # API integration logic
│   │   └── types/          # TypeScript Interfaces
│   └── vite.config.js
└── README.md

```