# MERN Todo Application

A fully functional, production-ready Todo application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

-   **Authentication**: Secure JWT-based Signup and Login.
-   **Task Management**: Create, Read, Update, Delete (CRUD) tasks.
-   **Status Tracking**: Mark tasks as Pending, In Progress, or Completed.
-   **Dashboard**: Visual progress bar and status filtering.
-   **Real-time Notifications**: Instant alerts for task updates using Socket.io.
-   **UI/UX**: Modern, responsive design using Tailwind CSS.

## Project Structure

```
/client     # React Frontend (Vite + Tailwind)
/server     # Node.js + Express Backend
```

## Setup Instructions

### Prerequisites

-   Node.js installed (v14+ recommended).
-   MongoDB installed and running locally.

### 1. Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in `server/` with the following:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/todo-app
    JWT_SECRET=your_super_secret_key_here
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup

1.  Open a new terminal and navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  (Optional) Create a `.env` file in `client/` if connecting to a remote backend:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

### 3. Usage

-   Open your browser at `http://localhost:5173`.
-   Sign up for a new account.
-   Start managing your tasks!

## Deployment

For a detailed, step-by-step guide on how to deploy this application to **GitHub** (code), **Vercel** (frontend), and **Render** (backend), please read the [DEPLOYMENT.md](./DEPLOYMENT.md) file included in this repository.
