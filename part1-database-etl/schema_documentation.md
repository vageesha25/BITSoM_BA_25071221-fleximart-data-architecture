# FlexiMart Database Schema Documentation

This document describes the relational database schema designed for the FlexiMart
e-commerce system. The schema supports customer management, product catalog,
order processing, and sales transactions. It is designed using relational
database principles and normalized up to Third Normal Form (3NF) to ensure
data integrity and minimize redundancy.


## ENTITY: customers
**Purpose:**  
Stores personal and contact information of customers who place orders on
the FlexiMart platform.

**Attributes:**
- `customer_id`: Unique identifier for each customer (Primary Key).
- `first_name`: Customer's first name.
- `last_name`: Customer's last name.
- `email`: Customer’s email address (unique and mandatory).
- `phone`: Customer’s contact number.
- `city`: City where the customer resides.
- `registration_date`: Date when the customer registered on the platform.

**Relationships:**
- One customer can place **many orders** (1:M relationship with the `orders` table).


## ENTITY: products
**Purpose:**  
Stores information about products available for sale on the FlexiMart platform.

**Attributes:**
- `product_id`: Unique identifier for each product (Primary Key).
- `product_name`: Name of the product.
- `category`: Category to which the product belongs.
- `price`: Unit price of the product.
- `stock_quantity`: Available inventory quantity.

**Relationships:**
- One product can appear in **many order items** (1:M relationship with `order_items`).


## ENTITY: orders
**Purpose:**  
Stores order-level information for purchases made by customers.

**Attributes:**
- `order_id`: Unique identifier for each order (Primary Key).
- `customer_id`: Identifier of the customer who placed the order (Foreign Key).
- `order_date`: Date on which the order was placed.
- `total_amount`: Total monetary value of the order.
- `status`: Current status of the order (e.g., Pending, Completed).

**Relationships:**
- Each order is placed by **one customer** (M:1 with `customers`).
- Each order can contain **many order items** (1:M with `order_items`).


## ENTITY: order_items
**Purpose:**  
Stores detailed line-item information for products included in each order.

**Attributes:**
- `order_item_id`: Unique identifier for each order item (Primary Key).
- `order_id`: Identifier of the related order (Foreign Key).
- `product_id`: Identifier of the product sold (Foreign Key).
- `quantity`: Number of units sold.
- `unit_price`: Price per unit at the time of sale.
- `subtotal`: Total amount for the line item (quantity × unit price).

**Relationships:**
- Many order items belong to **one order** (M:1 with `orders`).
- Many order items reference **one product** (M:1 with `products`).


## Normalization Explanation (Third Normal Form – 3NF)
The FlexiMart database schema is designed following normalization principles
and satisfies Third Normal Form (3NF). In First Normal Form (1NF), all tables
contain atomic values with no repeating groups or multi-valued attributes.
Each table has a clearly defined primary key to uniquely identify records.

In Second Normal Form (2NF), all non-key attributes are fully functionally
dependent on the entire primary key. For example, in the `order_items` table,
attributes such as quantity, unit_price, and subtotal depend on the
order_item_id and not partially on order_id or product_id alone.

The schema satisfies Third Normal Form (3NF) because there are no transitive
dependencies. Non-key attributes do not depend on other non-key attributes.
For instance, customer city and phone number depend only on customer_id and
are not stored redundantly in the orders table. Similarly, product price and
category are stored only in the products table and not duplicated in
order_items.

Functional dependencies include:
- customer_id → customer details
- product_id → product details
- order_id → order details

This design prevents update anomalies by ensuring data changes occur in only
one place, insert anomalies by allowing independent insertion of customers
or products, and delete anomalies by preserving customer and product data
even when orders are removed.


## Sample Data Representation

### customers
| customer_id | first_name | last_name | email             | phone         | city   | registration_date |
|------------|------------|-----------|--------------------|---------------|--------|-------------------|
| 1          | Amit       | Sharma    | amit@gmail.com     | +91-9876543210 | Delhi  | 2023-05-10        |
| 2          | Neha       | Verma     | neha@gmail.com     | +91-9123456789 | Mumbai| 2023-06-15        |

### products
| product_id | product_name | category     | price | stock_quantity |
|------------|--------------|--------------|-------|----------------|
| 101        | Laptop       | Electronics  | 55000 | 10             |
| 102        | Headphones   | Electronics  | 3000  | 25             |

### orders
| order_id | customer_id | order_date | total_amount | status   |
|----------|-------------|------------|--------------|----------|
| 201      | 1           | 2024-01-10 | 58000        | Completed|
| 202      | 2           | 2024-01-15 | 3000         | Pending  |

### order_items
| order_item_id | order_id | product_id | quantity | unit_price | subtotal |
|---------------|----------|------------|----------|------------|----------|
| 301           | 201      | 101        | 1        | 55000      | 55000    |
| 302           | 202      | 102        | 1        | 3000       | 3000     |
