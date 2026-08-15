# 🌶️ Spice Garden Restaurant - Full-Stack Website

A real, production-ready full-stack restaurant website built for **Spice Garden Restaurant** ("Good Food | Good Mood"). Built with React + JSX on the frontend, Node.js + Express.js on the backend, and connected directly to the existing MySQL database (`spice_garden`).

---

## 🌟 Key Features

### 🛒 Customer Experience
- **Hero Banner**: Full-screen dark luxury charcoal hero with authentic biryani imagery, taglines, CTA buttons, and floating WhatsApp & Call action badges.
- **Dynamic Menu**: Powered live by the MySQL `spice_garden` database with category filtering (All, Starters, Main Course, Biryani, Desserts, Beverages), dish descriptions, price tags, and ratings.
- **Cart & Checkout**: Slide-out cart drawer with live subtotal, GST (5%), and delivery fee calculations.
- **Razorpay Test Mode**: Integrated online payment flow with Razorpay test keys + Cash on Delivery fallback option.
- **Real MySQL Order Saving**: Every order placed generates a unique order number (e.g., `SG-20260808-xxxx`) and saves directly to MySQL `orders` and `order_items` tables.
- **Table Reservation**: Form with live reservation date/time/guest count selection saving into MySQL `reservations` table.
- **Food Gallery & Lightbox**: Interactive food gallery preview with lightbox modal.
- **Customer Reviews**: Dynamic review display from MySQL with customer review submission modal.

### 🛡️ Admin Panel & Management (`/admin`)
- **JWT & bcrypt Authentication**: Secure login portal for restaurant owners/admins.
- **Live MySQL Analytics Dashboard**: Real-time stats calculation for Total Orders, Revenue, Reservations, Total Customers, Recent Orders, and interactive trend SVG chart.
- **Menu Items Management**: View, add, edit, and delete food items.
- **Orders Management**: Track pending, preparing, out for delivery, and delivered orders with instant status updates in MySQL.
- **Reservations Management**: Approve, confirm, or cancel customer table bookings.
- **Customer Directory**: View customer spending metrics and last order history calculated from database transactions.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, JSX, Vite, Modern Vanilla CSS (Dark Charcoal `#121212`, Warm Orange `#E65100`, Gold `#FFB300`), Lucide Icons, Axios.
- **Backend**: Node.js, Express.js, RESTful API architecture.
- **Database**: MySQL 8.0 (`spice_garden`), `mysql2/promise` connection pool.
- **Authentication**: JSON Web Tokens (JWT) + `bcryptjs` password hashing.
- **Payment Gateway**: Razorpay (Test Mode Ready).

---

## 📁 Repository Structure

```
spiece resturant/
├── .env                  # Environment variables (MySQL password, JWT secret, Razorpay keys)
├── .env.example          # Template environment file
├── README.md             # Project documentation & guide
├── package.json          # Root scripts to run frontend and backend
├── database/
│   └── schema.sql        # Non-destructive schema migration file
├── backend/
│   ├── server.js         # Express app entry point
│   ├── config/           # MySQL pool connection config
│   ├── controllers/      # REST API controllers
│   ├── middleware/       # JWT auth & error middleware
│   ├── routes/           # Express API endpoints
│   └── utils/            # Order number generator
└── frontend/
    ├── index.html        # HTML entry point with fonts & Razorpay checkout
    ├── vite.config.js    # Vite configuration & proxy settings
    ├── src/
    │   ├── App.jsx       # Root React application
    │   ├── index.css     # Complete design system & custom styles
    │   ├── services/     # Axios API service layer
    │   ├── components/   # Customer website components
    │   └── admin/        # Admin portal & dashboard components
```

---

## 🚀 How to Run the Project

### 1. Database Setup
The application connects to your local MySQL server:
- **Database Name**: `spice_garden`
- **Host**: `localhost`
- **User**: `root`
- Configure the required credentials in your local `.env` file.

All existing tables (`categories`, `menu_items`, `users`, `reviews`, `reservations`, `orders`, `order_items`, `customers`, `contact_messages`) and records are preserved as the source of truth.

### 2. Install Dependencies

> [!NOTE]
> **Windows PowerShell Users**: If you get a script execution error (`npm.ps1 cannot be loaded because running scripts is disabled`), either run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` in PowerShell, or switch your terminal dropdown to **Command Prompt (cmd)**.

Install root, backend, and frontend packages:

```bash
# In the root directory:
npm run install:all
```
Or manually:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Start Backend Server

```bash
cd backend
npm run dev
# Server will run at http://localhost:5000
```

### 4. Start Frontend Development Server

```bash
cd frontend
npm run dev
# Frontend will run at http://localhost:3000
```

---

## 🔑 Admin Login Credentials

To access the Admin Dashboard:
1. Click **Admin Demo** button on the navbar or navigate to `/admin/login` inside the app.
2. Email: Configure your admin email locally.
3. Password: Configure your admin password securely.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/login` | Admin login & JWT token generation | Public |
| `GET` | `/api/menu` | Get menu items (supports `?category_id=`) | Public |
| `POST` | `/api/menu` | Add new dish item | Admin |
| `GET` | `/api/categories` | Get all food categories | Public |
| `POST` | `/api/orders` | Create new customer order in MySQL | Public |
| `GET` | `/api/orders` | Fetch orders list for management | Admin |
| `PUT` | `/api/orders/:id/status` | Update order status | Admin |
| `POST` | `/api/reservations` | Reserve table in MySQL | Public |
| `GET` | `/api/reviews` | Fetch approved customer reviews | Public |
| `POST` | `/api/reviews` | Submit new customer review | Public |
| `GET` | `/api/analytics/dashboard` | Fetch live MySQL metrics | Admin |
