# Real-Time Collaborative Notes App

## ✅ Objective
Build a Real-Time Collaborative Notes Application where multiple users can create, edit, and view notes in real-time with JWT-based authentication and Socket.IO for live updates, using Next.js 14, Redux Toolkit, Socket.IO, Express.js, MongoDB, Tailwind CSS, and Ant Design.

## 🛠️ Tech Stack
| Technology         | Purpose                     |
|----------------|------------------------------------|
| Next.js 14          | Fullstack framework |
| Redux Toolkit    | State management |
| Socket.IO         | Real-time communication |
| Express.js          | Backend API |
| MongoDB + Mongoose | Database |
| JWT (Access & Refresh Tokens) | Authentication |
| Tailwind CSS + Ant Design | UI/UX design |

## 🛑 Core Features

### JWT-based Authentication
- Signup/Login with Access & Refresh Tokens.
- Secure refresh token in HTTP-only cookie.
- Access token stored in memory for security.

### Real-Time Collaboration (Socket.IO)
- Live editing of notes.
- Real-time updates without page refresh.
- Multi-user collaboration on the same note.

### Backend API (Express.js + MongoDB)
- User Authentication (Signup, Login, Logout, Token Refresh).
- CRUD operations for notes (Create, Read, Update, Delete).
- WebSocket connection for real-time note updates.

### Frontend UI (Next.js + Redux Toolkit + Ant Design + Tailwind CSS)
- Authentication screens (Signup, Login, Logout).
- Dashboard for creating and editing notes.
- Real-time collaborative editing experience.

### Bonus Features
- User presence tracking (show who is editing).
- Optimized SEO with Next.js Server-Side Rendering (SSR).

## 📂 Architecture Flow
1️⃣ User logs in → Access token issued → Stored in memory.

2️⃣ Real-time WebSocket connection established.

3️⃣ User edits a note → Sends update to server via Socket.IO.

4️⃣ Server broadcasts updated note to all connected users.

5️⃣ Redux state updates and UI reflects changes in real-time.

6️⃣ Access token expires → Automatically refresh using Refresh Token.

## 🎯 Final Output
- Secure JWT-based Authentication
- Real-Time Note Editing
- Live Collaboration with Multiple Users
- Clean UI with Ant Design & Tailwind CSS
- Smooth User Experience with Redux

