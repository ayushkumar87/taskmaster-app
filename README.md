# TaskMaster - MERN Todo Application

A fully functional, production-ready Todo application built with the MERN stack (MongoDB, Express, React, Node.js).
**Recently updated with Real-time capabilities and Cloud Deployment readiness.**

## 🚀 Key Features (Updated)

-   **Real-time Notifications**: Instant red-dot alerts and dropdown notifications when tasks are created or updated (Powered by Socket.io).
-   **Robust Authentication**:
    -   Secure JWT Login/Signup.
    -   **New**: Red Error Boxes for failed logins/network errors.
    -   **New**: "Signing in..." loading states to improve UX.
    -   **New**: Mobile-responsive Auth cards.
-   **Responsive Design**:
    -   Fully optimized for Mobile devices (375px+).
    -   **New**: Sidebar Overlay on mobile for native-app feel.
-   **Dashboard**: Visual progress bar, stats, and task filtering.
-   **Deployment Ready**:
    -   Configured for **Render** (Backend) & **Vercel** (Frontend).
    -   Environment variable support (`VITE_API_URL`) for seamless cloud connection.

## 📂 Project Structure

```
/client     # React Frontend (Vite + Tailwind) - Authenticated, Responsive
/server     # Node.js + Express Backend - Socket.io enabled
```

## 🛠️ Quick Start (Local)

1.  **Backend**:
    ```bash
    cd server
    npm install
    npm run dev
    # Runs on http://localhost:5000
    ```
2.  **Frontend**:
    ```bash
    cd client
    npm install
    npm run dev
    # Runs on http://localhost:5173
    ```

## ☁️ Deployment Guide

I have included a detailed **[DEPLOYMENT.md](./DEPLOYMENT.md)** file in this repository. It covers:
1.  **GitHub**: Determining what to upload (handling `.gitignore`).
2.  **Render**: Hosting the Node.js/Socket.io backend.
    -   *Crucial*: Set `0.0.0.0/0` in MongoDB Network Access.
3.  **Vercel**: Hosting the React Frontend.
    -   *Crucial*: Set `VITE_API_URL` to your Render Link `.../api`.

## 🔄 Recent Changelog

-   **Fixed**: "Signup Failed" logic. Now properly handles network errors vs duplicate users.
-   **Fixed**: `api.js` now dynamically switches between `localhost` and `VITE_API_URL` for production.
-   **Added**: Mobile Sidebar Overlay and improved CSS media queries.
-   **Added**: Landing Page at root `/` with "Go to Dashboard" logic.

## 👤 Author

Ayush Kumar
