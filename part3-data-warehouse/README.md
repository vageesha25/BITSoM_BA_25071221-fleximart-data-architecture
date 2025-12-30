# Part 3: Data Warehouse and OLAP Analytics

## Overview

This module implements a dimensional data warehouse for FlexiMart to support historical sales analysis and business intelligence reporting. A star schema is designed, populated with sample data, and queried using OLAP-style analytical SQL.

---

## Objectives

- Design a star schema using dimensional modeling principles
- Implement fact and dimension tables in a data warehouse
- Load realistic historical sales data
- Perform OLAP analytics such as drill-down, segmentation, and ranking

---

## Key Components

### Star Schema Design
- `star_schema_design.md` documents:
  - Fact and dimension tables
  - Grain definition
  - Design decisions and rationale
  - Sample data flow from source to warehouse

### Warehouse Schema
- `warehouse_schema.sql` creates:
  - Date, Product, and Customer dimensions
  - Sales fact table with foreign key relationships

### Warehouse Data
- `warehouse_data.sql` loads:
  - Time-based dimension data
  - Product and customer master data
  - Sales fact records with realistic patterns

### OLAP Analytics
- `analytics_queries.sql` includes:
  - Time-based drill-down analysis
  - Top product performance analysis
  - Customer segmentation using CASE and aggregations

---

## Technologies Used

- MySQL
- SQL (DDL, DML, OLAP queries)

---

## Outcome

This module enables advanced analytical reporting through a well-structured data warehouse. The star schema supports efficient aggregation, drill-down, and business decision-making using historical data.
