USE fleximart_dw;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE fact_sales;
TRUNCATE TABLE dim_customer;
TRUNCATE TABLE dim_product;
TRUNCATE TABLE dim_date;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO dim_date VALUES
(20240101,'2024-01-01','Monday',1,1,'January','Q1',2024,0),
(20240102,'2024-01-02','Tuesday',2,1,'January','Q1',2024,0),
(20240103,'2024-01-03','Wednesday',3,1,'January','Q1',2024,0),
(20240104,'2024-01-04','Thursday',4,1,'January','Q1',2024,0),
(20240105,'2024-01-05','Friday',5,1,'January','Q1',2024,0),
(20240106,'2024-01-06','Saturday',6,1,'January','Q1',2024,1),
(20240107,'2024-01-07','Sunday',7,1,'January','Q1',2024,1),

(20240201,'2024-02-01','Thursday',1,2,'February','Q1',2024,0),
(20240202,'2024-02-02','Friday',2,2,'February','Q1',2024,0),
(20240203,'2024-02-03','Saturday',3,2,'February','Q1',2024,1),
(20240204,'2024-02-04','Sunday',4,2,'February','Q1',2024,1),
(20240205,'2024-02-05','Monday',5,2,'February','Q1',2024,0);

INSERT INTO dim_product (product_id, product_name, category, subcategory, unit_price) VALUES
('P001','iPhone 15','Electronics','Mobile',95000),
('P002','Samsung Galaxy S23','Electronics','Mobile',85000),
('P003','Dell Laptop','Electronics','Laptop',72000),
('P004','Bluetooth Speaker','Electronics','Audio',3500),
('P005','Smart Watch','Electronics','Wearable',12000),

('P006','Running Shoes','Fashion','Footwear',4500),
('P007','Leather Jacket','Fashion','Outerwear',18000),
('P008','Jeans','Fashion','Clothing',2500),
('P009','T-Shirt','Fashion','Clothing',900),
('P010','Sneakers','Fashion','Footwear',5500),

('P011','Dining Table','Home','Furniture',42000),
('P012','Office Chair','Home','Furniture',9000),
('P013','LED Lamp','Home','Lighting',1200),
('P014','Microwave Oven','Home','Appliances',15000),
('P015','Vacuum Cleaner','Home','Appliances',22000);

INSERT INTO dim_customer (customer_id, customer_name, city, state, customer_segment) VALUES
('C001','Amit Sharma','Delhi','Delhi','Retail'),
('C002','Neha Verma','Delhi','Delhi','Corporate'),
('C003','Rahul Mehta','Mumbai','Maharashtra','Retail'),
('C004','Pooja Singh','Mumbai','Maharashtra','Retail'),
('C005','Ankit Jain','Bengaluru','Karnataka','Corporate'),
('C006','Sneha Rao','Bengaluru','Karnataka','Retail'),
('C007','Karthik Iyer','Chennai','Tamil Nadu','Retail'),
('C008','Divya Menon','Chennai','Tamil Nadu','Corporate'),
('C009','Rohit Khanna','Delhi','Delhi','Retail'),
('C010','Meera Nair','Mumbai','Maharashtra','Corporate'),
('C011','Suresh Patel','Bengaluru','Karnataka','Retail'),
('C012','Kavita Joshi','Chennai','Tamil Nadu','Retail');

INSERT INTO fact_sales
(date_key, product_key, customer_key, quantity_sold, unit_price, discount_amount, total_amount)
VALUES
(20240106,1,1,1,95000,5000,90000),
(20240107,2,2,2,85000,8000,162000),
(20240106,6,3,3,4500,500,13000),
(20240107,7,4,1,18000,2000,16000),
(20240203,3,5,1,72000,7000,65000),

(20240203,4,6,4,3500,500,13500),
(20240204,5,7,2,12000,1000,23000),
(20240203,11,8,1,42000,4000,38000),
(20240204,12,9,2,9000,1000,17000),
(20240205,14,10,1,15000,1500,13500);

SELECT COUNT(*) FROM dim_date;     
SELECT COUNT(*) FROM dim_product;  
SELECT COUNT(*) FROM dim_customer; 
SELECT COUNT(*) FROM fact_sales;    
