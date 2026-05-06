# AutoCare Pro 🚘🔧

A premium all-in-one car servicing and auto parts platform built with the MERN stack and Tailwind CSS.

## Features

*   **Role-Based Access Control:** Customer, Admin, Technician, Seller roles.
*   **Vehicle Management:** Add and manage user vehicles.
*   **Service Booking:** 4-step wizard to book services and pick available time slots.
*   **E-Commerce Store:** Browse auto parts with filters and add to cart.
*   **Checkout & Orders:** Place orders with COD and track order history.
*   **Service History:** Timeline view of vehicle service records.
*   **Admin Dashboard:** Charts, stats, and low-stock alerts.

## Tech Stack

*   **Frontend:** React (Vite), Tailwind CSS, React Router, Zustand, Axios, Recharts, Lucide React.
*   **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT Auth, express-rate-limit.

## Getting Started

### 1. Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas)

### 2. Installation
Install all dependencies across root, server, and client:
```bash
npm run install:all
```

### 3. Environment Variables
Create a `.env` file in the `server` directory (one is provided by default):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/autocare-pro
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Database Seeding (Optional but recommended)
Populate the database with sample users and products:
```bash
npm run seed
```

**Demo Users created by seed:**
*   **Admin:** admin@test.com / password123
*   **Customer:** customer@test.com / password123
*   **Seller:** seller@test.com / password123

### 5. Running the App
Start both frontend and backend concurrently:
```bash
npm run dev
```

*   Frontend: `http://localhost:5173`
*   Backend API: `http://localhost:5000`

## API Documentation

### Auth Endpoints
*   `POST /api/auth/register` - Register new user
*   `POST /api/auth/login` - Login user
*   `GET /api/auth/me` - Get current user profile
*   `POST /api/auth/logout` - Logout

### Service & Vehicles
*   `GET /api/vehicles` - Get user vehicles
*   `POST /api/bookings` - Create a service booking
*   `GET /api/bookings/available-slots?date=...` - Get available time slots

### E-Commerce
*   `GET /api/products` - Browse products (with query filters)
*   `GET /api/cart` - Get user cart
*   `POST /api/orders/checkout` - Place an order

### Admin
*   `GET /api/admin/stats` - Dashboard stats
*   `GET /api/admin/analytics/revenue` - Revenue over time
