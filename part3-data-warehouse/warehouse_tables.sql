CREATE DATABASE fleximart_dw;
USE fleximart_dw;

CREATE TABLE dim_date (
  date_key INT PRIMARY KEY,
  full_date DATE,
  day_of_week VARCHAR(10),
  month INT,
  month_name VARCHAR(15),
  quarter VARCHAR(2),
  year INT,
  is_weekend BOOLEAN
);

CREATE TABLE dim_product (
  product_key INT AUTO_INCREMENT PRIMARY KEY,
  product_id VARCHAR(20),
  product_name VARCHAR(100),
  category VARCHAR(50),
  brand VARCHAR(50),
  unit_price DECIMAL(10,2),
  is_active BOOLEAN
);

CREATE TABLE dim_customer (
  customer_key INT AUTO_INCREMENT PRIMARY KEY,
  customer_id VARCHAR(20),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100),
  city VARCHAR(50),
  state VARCHAR(50),
  country VARCHAR(50),
  signup_date DATE
);

CREATE TABLE fact_sales (
  sales_key INT AUTO_INCREMENT PRIMARY KEY,
  date_key INT,
  product_key INT,
  customer_key INT,
  quantity_sold INT,
  unit_price DECIMAL(10,2),
  discount_amount DECIMAL(10,2),
  total_amount DECIMAL(10,2),

  FOREIGN KEY (date_key) REFERENCES dim_date(date_key),
  FOREIGN KEY (product_key) REFERENCES dim_product(product_key),
  FOREIGN KEY (customer_key) REFERENCES dim_customer(customer_key)
);

INSERT INTO dim_date VALUES
(20240115, '2024-01-15', 'Monday', 1, 'January', 'Q1', 2024, FALSE),
(20240120, '2024-01-20', 'Saturday', 1, 'January', 'Q1', 2024, TRUE),
(20240205, '2024-02-05', 'Monday', 2, 'February', 'Q1', 2024, FALSE);

INSERT INTO dim_product
(product_id, product_name, category, brand, unit_price, is_active)
VALUES
('ELEC001', 'Samsung Galaxy S21', 'Electronics', 'Samsung', 79999, TRUE),
('FASH001', 'Running Shoes', 'Fashion', 'Nike', 4500, TRUE);

INSERT INTO dim_customer
(customer_id, first_name, last_name, email, city, state, country, signup_date)
VALUES
('C001', 'Amit', 'Sharma', 'amit@gmail.com', 'Delhi', 'Delhi', 'India', '2023-12-01'),
('C002', 'Neha', 'Verma', 'neha@gmail.com', 'Mumbai', 'Maharashtra', 'India', '2024-01-10');

INSERT INTO fact_sales
(date_key, product_key, customer_key, quantity_sold, unit_price, discount_amount, total_amount)
VALUES
(20240115, 1, 1, 1, 79999, 5000, 74999),
(20240120, 2, 2, 2, 4500, 500, 8500);