-- ============================================
-- Solabucks Database Schema
-- Run this in MySQL to create the database
-- ============================================

CREATE DATABASE IF NOT EXISTS solabucks;
USE solabucks;

-- Users/Customers table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu items (for reference - prices)
CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(20) NOT NULL UNIQUE,
    user_id INT,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order items (individual items in each order)
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Insert default menu items
INSERT INTO menu_items (name, price, category) VALUES
('Solar Latte', 200, 'Hot Coffees'),
('Cosmic Mocha', 250, 'Hot Coffees'),
('Sunrise Cappuccino', 300, 'Hot Coffees'),
('Solar Americano', 400, 'Hot Coffees'),
('Starboard Macchiato', 450, 'Hot Coffees'),
('Pure Shot Espresso', 300, 'Hot Coffees'),
('Arctic Iced Coffee', 200, 'Cold Drinks'),
('Midnight Cold Brew', 275, 'Cold Drinks'),
('Solar Frappuccino', 250, 'Cold Drinks'),
('Ice Galaxy Latte', 300, 'Cold Drinks'),
('Green Energy Matcha', 150, 'Specialty Teas'),
('Spiced Chai Latte', 175, 'Specialty Teas'),
('Moonlit Hot Chocolate', 199, 'Specialty Teas'),
('Butter Croissant', 299, 'Fresh Bakery'),
('Blueberry Bliss Muffin', 325, 'Fresh Bakery'),
('Sunrise Bagel', 375, 'Fresh Bakery'),
('Chocolate Chip Cookie', 250, 'Fresh Bakery');

-- Create index for faster lookups
CREATE INDEX idx_order_order_id ON orders(order_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_users_email ON users(email);
