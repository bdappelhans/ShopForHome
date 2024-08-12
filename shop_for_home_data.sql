-- Insert sample addresses
INSERT INTO addresses (state, city, street, zip_code) VALUES
('California', 'Los Angeles', '123 Sunset Blvd', 90001),
('New York', 'New York', '456 Broadway', 10001),
('Texas', 'Austin', '789 Congress Ave', 73301);

-- Insert sample users
INSERT INTO users (email, first_name, last_name, password, is_admin, address_id) VALUES
('nancy.wheeler@gmail.com', 'Nancy', 'Wheeler', 'passwordNancy123', FALSE, 1),
('dustin.henderson@gmail.com', 'Dustin', 'Henderson', 'passwordDustin123', FALSE, 2),
('lucas.sinclair@gmail.com', 'Lucas', 'Sinclair', 'passwordLucas123', FALSE, 3);

-- Insert an admin user without an address
INSERT INTO users (email, first_name, last_name, password, is_admin, address_id) VALUES
('admin@gmail.com', 'Admin', 'Admin', 'adminPassword123', TRUE, NULL);

-- Insert sample products
INSERT INTO products (description, price, stock, image_url) VALUES 
('Bellino Striped Denim Indoor/Outdoor Area Rug', 139.99, 50, '/products/bellino-striped-rug.png'), 
('Whelchel 6 - Light Dimmable Sputnik Modern Linear Chandelier', 127.99, 50, '/products/dimmable-sputnik-modern-chandelier.png'), 
('Kennamer Metal Slat Back Side Chair (Set of 2)', 167.99, 50, '/products/metal-slat-back-side-chair.png');

-- Insert two sample coupons into the coupons table
INSERT INTO coupons (discount, is_active) VALUES
(10.00, TRUE),  -- Coupon with a 10% discount, active
(20.00, TRUE);  -- Coupon with a 20% discount, active

