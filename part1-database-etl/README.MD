# Part 1: Database ETL and Business Queries

## Overview

This module focuses on building an end-to-end ETL (Extract, Transform, Load) pipeline for FlexiMart’s transactional data. Raw CSV files containing customer, product, and sales data are processed using Python, cleaned for data quality issues, and loaded into a relational database for structured querying and reporting.

---

## Objectives

- Extract raw data from CSV files
- Perform data cleaning and validation
- Load cleaned data into a relational database
- Generate business insights using SQL queries
- Produce a data quality report

---

## Key Components

### ETL Pipeline
- Implemented in `etl_pipeline.py`
- Handles duplicate removal, missing value treatment, and schema validation
- Loads processed data into MySQL database (`fleximart`)

### Schema Documentation
- `schema_documentation.md` describes tables, attributes, and relationships
- Explains normalization and design rationale

### Business Queries
- `business_queries.sql` contains SQL queries answering business questions
- Includes aggregations, joins, and filtering logic

### Data Quality Report
- `data_quality_report.txt` summarizes:
  - Records processed
  - Duplicates removed
  - Missing values handled
  - Records successfully loaded

---

## Technologies Used

- Python 3.x
- pandas
- MySQL
- SQL

---

## Outcome

This module establishes a reliable and clean relational data foundation, enabling accurate reporting and serving as the source for downstream analytics and data warehousing.
