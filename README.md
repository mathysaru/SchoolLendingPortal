# School Equipment Lending Portal

## Overview
The **School Equipment Lending Portal** is a full-stack web application designed to help schools **manage, track, and borrow** equipment efficiently.  
Admins can manage inventory, staff can issue/return items, and students can request loans — all within a secure, responsive Neumorphic interface.

---

## Features
- **User Roles:** Admin, Staff, and Student
- **Equipment Management:** Add, edit, and delete school items
- **Booking System:** Borrow and return items with approval tracking
- **Authentication & Authorization:** Secure JWT-based login/signup
- **API Documentation** via Swagger UI
- **Dashboard & History:** Manage items, monitor borrowing stats
- **AI Assistance:** Code generation and optimization using ChatGPT & GitHub Copilot

---

## Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + Tailwind CSS (Neumorphism UI) |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB Atlas |
| **Auth** | JWT (JSON Web Tokens) |
| **API Docs** | Swagger UI |
| **Deployment** | Docker (Local/Minikube-ready) |

---

## System Architecture

### 🧩 High-Level Design

[ React Frontend ]
↓
[ Express.js REST API ]
↓
[ MongoDB Atlas Database ]


All communication between frontend and backend happens via secure REST APIs, authenticated using JWT.

---

### ⚙️ Backend Architecture

server.js
├── swagger.js / swagger.yaml (API Docs)
├── routes/
│ ├── authRoutes.js
│ ├── itemRoutes.js
│ └── bookingRoutes.js
├── controllers/
│ ├── authController.js
│ ├── itemController.js
│ └── bookingController.js
├── models/
│ ├── User.js
│ ├── Item.js
│ └── Booking.js
├── middlewares/
│ └── authMiddleware.js
└── config/
└── db.js


---

### 🧩 Frontend Component Hierarchy

App.js
├── NavBar.jsx
├── Routes/
│ ├── Home.jsx
│ ├── Login.jsx
│ ├── Signup.jsx
│ ├── ManageBookings.jsx
│ ├── AdminItems.jsx
│ └── Profile.jsx
├── Context/
│ └── AuthContext.jsx
└── UI/
├── ConfirmModal.jsx
├── ItemCard.jsx
└── NeumorphicButton.jsx


---

## 🧱 Database Schema (MongoDB)

### 🧩 Entities

| Collection | Fields | Description |
|-------------|---------|-------------|
| **users** | `_id`, `name`, `email`, `password`, `role` | Stores login credentials and role |
| **items** | `_id`, `name`, `category`, `description`, `quantity`, `available` | Equipment details |
| **bookings** | `_id`, `userId`, `itemId`, `borrowDate`, `returnDate`, `status` | Tracks who borrowed which item |

---

### 🧭 ER Diagram
```mermaid
erDiagram
    USER {
        string _id
        string name
        string email
        string password
        string role
    }

    ITEM {
        string _id
        string name
        string category
        string description
        number quantity
        boolean available
    }

    BOOKING {
        string _id
        string userId
        string itemId
        string status
        date borrowDate
        date returnDate
    }

    USER ||--o{ BOOKING : "makes"
    ITEM ||--o{ BOOKING : "is booked"
