# MERN Todo Application

A fully functional, production-ready Todo application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

-   **Authentication**: Secure JWT-based Signup and Login.
-   **Task Management**: Create, Read, Update, Delete (CRUD) tasks.
-   **Status Tracking**: Mark tasks as Pending, In Progress, or Completed.
-   **Dashboard**: Visual progress bar and status filtering.
-   **UI/UX**: Modern, responsive design using Tailwind CSS.

## Project Structure

```
/client     # React Frontend (Vite + Tailwind)
/server     # Node.js + Express Backend
```

## Setup Instructions

### Prerequisites

-   Node.js installed.
-   MongoDB installed and running locally (or have a connection string).

### 1. Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory (already created):
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/todo-app
    JWT_SECRET=your_jwt_secret
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup

1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

### 3. Usage

-   Open your browser at `http://localhost:5173` (Vite default).
-   Sign up for a new account.
-   Start managing your tasks!

## Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS, Axios, React Router, Date-fns
-   **Backend**: Node.js, Express, Mongoose, JWT, Bcrypt
-   **Database**: MongoDB
