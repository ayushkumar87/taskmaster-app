# TaskMaster Backend (Server)

This is the backend for the TaskMaster application, built with Node.js, Express, MongoDB, and Socket.io.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    -   Create a `.env` file in this directory with the following variables:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/todo-app
    JWT_SECRET=your_secure_secret
    ```

3.  **Run Server**:
    -   Development (with hot reload):
        ```bash
        npm run dev
        ```
    -   Production:
        ```bash
        npm start
        ```

## API Routes

-   `/api/auth` - Authentication (Login/Signup)
-   `/api/todos` - Task Management
-   `/api/feedback` - User Feedback

## Real-time

Socket.io is running on the same port (`5000` by default) to handle real-time notifications.
