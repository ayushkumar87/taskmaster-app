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

## Deployment

### GitHub (Code Hosting)

1.  Create a new repository on GitHub (e.g., `taskmaster-app`).
2.  Push your code:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/taskmaster-app.git
    git branch -M main
    git push -u origin main
    ```

### Frontend Deployment (Vercel/Netlify)

1.  Push your code to GitHub.
2.  Import the repository into **Vercel** or **Netlify**.
3.  Set the **Root Directory** to `client` (or keep default if configuring manually).
4.  Build command: `npm run build`.
5.  Output directory: `dist`.

### Backend Deployment (Render/Railway/Heroku)

1.  Push your code to GitHub.
2.  Import the repository into your hosting provider.
3.  Set the **Root Directory** to `server`.
4.  Build command: `npm install`.
5.  Start command: `npm start` (or `node server.js`).
6.  **Important:** Add your Environment Variables (`MONGO_URI`, `JWT_SECRET`) in the hosting dashboard.
