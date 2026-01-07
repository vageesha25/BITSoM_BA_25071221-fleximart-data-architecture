# Sales Analytics System

## Overview
This project is a Python-based Sales Analytics System developed as part of Module 3.
The system reads raw sales transaction data, cleans and validates the records based on
defined business rules, and produces a summary of valid and invalid records.

---

## Project Structure
sales-analytics-system/
  ├── README.md
  ├── main.py
  ├── utils/
  │   ├── file_handler.py
  │   ├── data_processor.py
  │   └── api_handler.py
  ├── data/
  │   └── sales_data.txt (provided)
  ├── output/
  └── requirements.txt



---

## Data Description
- Input File: `sales_data.txt`
- Format: Pipe (`|`) delimited
- Encoding: Non-UTF-8 (handled using latin-1)
- Total records: 80

---

## Data Cleaning Rules

### Records Removed (Invalid)
- Missing CustomerID or Region
- Quantity ≤ 0
- UnitPrice ≤ 0
- TransactionID not starting with `T`
- Corrupt or malformed records

### Records Cleaned and Kept (Valid)
- Commas removed from ProductName
- Commas removed from Quantity and UnitPrice
- Quantity converted to integer
- UnitPrice converted to float
- Empty lines skipped

---

## How to Run the Project

### Prerequisites
- Python 3.x
- Git Bash / Terminal

### Steps
1. Navigate to the project directory:
   ```bash
   cd sales-analytics-system
