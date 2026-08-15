-- Spice Garden Restaurant Database Schema Initialization
-- Safe migration file - DOES NOT DROP OR TRUNCATE EXISTING TABLES OR DATA

CREATE DATABASE IF NOT EXISTS spice_garden;
USE spice_garden;

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(9,2) NOT NULL,
  image VARCHAR(255),
  rating DECIMAL(2,1) DEFAULT 4.5,
  available TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 3. Users Table (Admin & Customers)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(25) NOT NULL,
  email VARCHAR(150) UNIQUE,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_id INT NOT NULL,
  subtotal DECIMAL(9,2) NOT NULL,
  tax DECIMAL(9,2) NOT NULL,
  delivery_fee DECIMAL(9,2) NOT NULL,
  total_amount DECIMAL(9,2) NOT NULL,
  order_type ENUM('delivery', 'pickup', 'dine_in') NOT NULL,
  delivery_address TEXT,
  payment_method ENUM('cash_on_delivery', 'online_payment') NOT NULL,
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  order_status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(9,2) NOT NULL,
  subtotal DECIMAL(9,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- 7. Table Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NULL,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(25) NOT NULL,
  email VARCHAR(150) NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  number_of_people INT NOT NULL,
  special_request TEXT,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 8. Customer Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NULL,
  name VARCHAR(120) NOT NULL,
  rating TINYINT NOT NULL,
  comment TEXT NOT NULL,
  image VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'approved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(25),
  message TEXT NOT NULL,
  status ENUM('unread', 'read', 'replied') NOT NULL DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
