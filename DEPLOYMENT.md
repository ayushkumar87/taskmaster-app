# Deployment Guide to GitHub & Vercel

This guide provides step-by-step instructions to host your MERN stack application.

## Part 1: Upload to GitHub

1.  **Initialize Git (if not done already)**
    Open your project root folder in a terminal and run:
    ```bash
    git init
    git add .
    git commit -m "Ready for deployment"
    ```

2.  **Create a Repository on GitHub**
    *   Go to [GitHub.com/new](https://github.com/new).
    *   **Repository name**: `taskmaster-app`.
    *   **Visibility**: Public.
    *   Click **Create repository**.

3.  **Push Code to GitHub**
    Copy the commands provided by GitHub (under *"…or push an existing repository"*) and run them in your terminal:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/taskmaster-app.git
    git branch -M main
    git push -u origin main
    ```
    *(Replace `YOUR_USERNAME` with your actual GitHub username)*

---

## Part 2: Deploy Frontend to Vercel

Vercel is excellent for hosting the React frontend.

1.  **Sign Up / Login**
    *   Go to [Vercel.com](https://vercel.com) and sign up/login with your **GitHub account**.

2.  **Import Project**
    *   On your Vercel dashboard, click **"Add New..."** > **"Project"**.
    *   Find `taskmaster-app` in the list (click "Import").

3.  **Configure Project**
    *   **Framework Preset**: Vite (Vercel usually detects this automatically).
    *   **Root Directory**: Click "Edit" and select **`client`** (IMPORTANT: Do not select the root folder, select the `client` folder).
    
    *   **Build & Output Settings**:
        *   Build Command: `npm run build`
        *   Output Directory: `dist`
    
    *   **Environment Variables**:
        *   Click "Environment Variables".
        *   Add `VITE_API_URL` with your backend URL (e.g., `https://your-backend-app.onrender.com/api`).
        *   *Note: For now, if you haven't deployed the backend, you can skip this or put `http://localhost:5000/api` for testing locally via tunneling, but for production, you need a live backend URL.*

4.  **Deploy**
    *   Click **"Deploy"**.
    *   Wait for a minute, and your frontend is live! 🚀

---

## Part 3: Backend Hosting (Required)

Since Vercel is optimized for frontends, you need a separate host for your Node.js/Express backend. We recommend **Render** or **Railway**.

### Option A: Render (Free Tier)
1.  Go to [Render.com](https://render.com).
2.  New **"Web Service"**.
3.  Connect your GitHub repo.
4.  **Root Directory**: `server`.
5.  **Build Command**: `npm install`.
6.  **Start Command**: `node server.js` (or `npm start`).
7.  **Environment Variables** (Advanced):
    *   `MONGO_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: A secret key for passwords.
    *   `PORT`: `10000` (Render default).

Once deployed, copy the **Backend URL** from Render and update your Vercel Environment Variable (`VITE_API_URL`) with it.
