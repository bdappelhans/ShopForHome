-- Drop the schema if it already exists
DROP SCHEMA IF EXISTS shop_for_home;

-- Create the schema
CREATE SCHEMA shop_for_home;

-- Use the schema
USE shop_for_home;

-- Drop the addresses table if it already exists
DROP TABLE IF EXISTS addresses;

-- Create the addresses table
CREATE TABLE addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    state VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    zip_code INT NOT NULL
);

-- Drop the coupons table if it already exists
DROP TABLE IF EXISTS coupons;

-- Create the coupons table
CREATE TABLE coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discount DECIMAL(5, 2) NOT NULL, -- Represents a percentage discount (e.g., 10.00 for 10%)
    is_active BOOLEAN NOT NULL DEFAULT TRUE       -- Indicates whether the coupon is active
);

-- Drop the users table if it already exists
DROP TABLE IF EXISTS users;

-- Create the users table with the password column
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE, -- Ensures email addresses are unique
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,     -- Password column
    is_admin BOOLEAN DEFAULT FALSE,     -- Defaults to false
    address_id INT NULL,
    coupon_id INT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (address_id) REFERENCES addresses(id),
    FOREIGN KEY (coupon_id) REFERENCES coupons(id)
);

-- Drop the products table if it already exists
DROP TABLE IF EXISTS products;

-- Create the products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL, -- Description of the product
    price DECIMAL(10, 2) NOT NULL,     -- Price of the product
    stock INT NOT NULL,                -- Quantity of the product in stock
    image_url VARCHAR(255),            -- URL to the product's image
    is_active BOOLEAN DEFAULT TRUE     
);
    
-- Drop the orders table if it already exists
DROP TABLE IF EXISTS orders;

-- Create the orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date_time TIMESTAMP NULL,           -- Timestamp of the order date and time
    coupon_id INT NULL,
    is_placed boolean DEFAULT FALSE,
    initial_total DECIMAL(10, 2) DEFAULT 0.00, -- Total before discount, defaults to 0.00
    discount DECIMAL(10, 2) DEFAULT 0.00,       -- Discount in dollar amount, defaults to 0.00
    final_total DECIMAL(10, 2) DEFAULT 0.00,    -- Total after discount, defaults to 0.00
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (coupon_id) REFERENCES coupons(id)
);

-- Drop the order_products table if it already exists
DROP TABLE IF EXISTS order_products;

-- Create the order_products table
CREATE TABLE order_products (
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Drop the wish_list table if it already exists
DROP TABLE IF EXISTS wish_list;

-- Create the wish_list table
CREATE TABLE wish_list (
    user_id INT,
    product_id INT,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

