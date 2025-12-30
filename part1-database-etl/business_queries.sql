-- Query 1: Customer Purchase History
-- Business Question:
-- Generate a detailed report showing each customer's name, email,
-- total number of orders placed, and total amount spent.
-- Include only customers who have placed at least 2 orders
-- and spent more than ₹5,000.

SELECT
  CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
  c.email,
  COUNT(DISTINCT o.order_id) AS total_orders,
  SUM(oi.subtotal) AS total_spent
FROM customers c
JOIN orders o
  ON c.customer_id = o.customer_id
JOIN order_items oi
  ON o.order_id = oi.order_id
GROUP BY c.customer_id
HAVING
  COUNT(DISTINCT o.order_id) >= 2
  AND SUM(oi.subtotal) > 5000
ORDER BY total_spent DESC;


-- Query 2: Product Sales Analysis
-- Business Question:
-- For each product category, show the category name, number of
-- different products sold, total quantity sold, and total revenue generated.
-- Only include categories that have generated more than ₹10,000 in revenue.

SELECT
  p.category,
  COUNT(DISTINCT p.product_id) AS num_products,
  SUM(oi.quantity) AS total_quantity_sold,
  SUM(oi.subtotal) AS total_revenue
FROM products p
JOIN order_items oi
  ON p.product_id = oi.product_id
GROUP BY p.category
HAVING SUM(oi.subtotal) > 10000
ORDER BY total_revenue DESC;


-- Query 3: Monthly Sales Trend
-- Business Question:
-- Show monthly sales trends for the year 2024.
-- For each month, display the month name, total number of orders,
-- total revenue, and the running total of revenue.

SELECT
  MONTHNAME(o.order_date) AS month_name,
  COUNT(DISTINCT o.order_id) AS total_orders,
  SUM(o.total_amount) AS monthly_revenue,
  SUM(SUM(o.total_amount)) OVER (
    ORDER BY MONTH(o.order_date)
  ) AS cumulative_revenue
FROM orders o
WHERE YEAR(o.order_date) = 2024
GROUP BY
  MONTH(o.order_date),
  MONTHNAME(o.order_date)
ORDER BY
  MONTH(o.order_date);
