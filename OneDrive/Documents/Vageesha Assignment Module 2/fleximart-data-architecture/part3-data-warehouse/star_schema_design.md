## Section 1: Schema Overview

### FACT TABLE: fact_sales

Grain:
One row per product per order line item.

Business Process:
Captures sales transactions for analytical reporting.

Measures (Numeric Facts):
- quantity_sold: Number of units sold
- unit_price: Price per unit at time of sale
- discount_amount: Discount applied
- total_amount: Final amount (quantity × unit_price − discount)

Foreign Keys:
- date_key → dim_date
- product_key → dim_product
- customer_key → dim_customer


### DIMENSION TABLE: dim_date

Purpose:
Provides time-based analysis capabilities.

Attributes:
- date_key (PK): Surrogate key in YYYYMMDD format
- full_date: Actual calendar date
- day_of_week: Day name
- month: Month number
- month_name: Month name
- quarter: Quarter (Q1–Q4)
- year: Calendar year
- is_weekend: Boolean flag

### DIMENSION TABLE: dim_date

Purpose:
Provides time-based analysis capabilities.

Attributes:
- date_key (PK): Surrogate key in YYYYMMDD format
- full_date: Actual calendar date
- day_of_week: Day name
- month: Month number
- month_name: Month name
- quarter: Quarter (Q1–Q4)
- year: Calendar year
- is_weekend: Boolean flag

## Section 2: Design Decisions

The fact table is designed at the transaction line-item level to capture the most granular sales data possible. This granularity allows detailed analysis of product performance, customer behavior, and discount impact, while still supporting aggregation at higher levels such as monthly or yearly sales.

Surrogate keys are used instead of natural business keys to ensure stability and performance. Business keys such as product_id or customer_id may change over time, whereas surrogate keys remain consistent, preserving historical accuracy and improving join performance.

This star schema supports drill-down and roll-up operations efficiently. Analysts can roll up sales data from daily to monthly or yearly levels using the date dimension, or drill down from category-level sales to individual products, enabling flexible and fast OLAP analysis.


## Section 3: Sample Data Flow

Source Transaction:
Order #101, Customer "John Doe", Product "Laptop", Quantity 2, Price 50000.

Data Warehouse Representation:

fact_sales:
- date_key: 20240115
- product_key: 5
- customer_key: 12
- quantity_sold: 2
- unit_price: 50000
- total_amount: 100000

dim_date:
- date_key: 20240115
- full_date: '2024-01-15'
- month: 1
- quarter: 'Q1'

dim_product:
- product_key: 5
- product_name: 'Laptop'
- category: 'Electronics'

dim_customer:
- customer_key: 12
- customer_name: 'John Doe'
- city: 'Mumbai'
