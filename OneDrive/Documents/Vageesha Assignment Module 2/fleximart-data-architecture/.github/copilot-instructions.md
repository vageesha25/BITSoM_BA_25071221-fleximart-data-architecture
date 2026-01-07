# Copilot / AI agent instructions — Fleximart ETL

Short, actionable guidance to get an AI coding agent productive in this repository.

## Big picture (what this repo does)
- Single-step ETL: reads CSVs from `data/` and loads into MySQL (primary) or falls back to CSV + SQLite in `part1-database-etl/fallback_output/`.
- Main entrypoint: `part1-database-etl/etl_pipeline.py` — contains parsing, cleaning, normalization, MySQL load, and fallback logic.
- Logging and reporting: writes `etl.log` (detailed run log) and `data_quality_report.txt` (human-readable metrics) at repo root on success; fallback writes report under `part1-database-etl/fallback_output/`.

## How to run (examples)
- Dry-run (no DB or file writes):
  - `python part1-database-etl/etl_pipeline.py --dry-run`
- Full run (attempt MySQL then fallback):
  - `python part1-database-etl/etl_pipeline.py`
- Recommended workflow: always run dry-run first, inspect `etl.log` and `part1-database-etl/fallback_output/` before a full run.

## Environment & credentials
- DB creds read from environment variables (recommended): `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DB`, `MYSQL_HOSTS` (comma-separated), `MYSQL_PORT`.
- The script will load a `.env` at repo root if `python-dotenv` is installed.
- For Windows PowerShell, activate the venv using:
  - `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` then `. .\.venv\Scripts\Activate.ps1`

## Important project-specific conventions & patterns
- CSVs must live in `data/` named: `customers_raw.csv`, `products_raw.csv`, `sales_raw.csv`.
- Column handling:
  - Column names are normalized to `lower()` and `strip()` — prefer lowercase in tests and small edits.
  - The script creates missing required columns (see `ensure_columns` usage) with default pd.NA values. Required columns include:
    - customers: `customer_id, first_name, last_name, email, phone, city, registration_date`
    - products: `product_id, product_name, category, price, stock_quantity`
    - sales: `transaction_id, customer_id, product_id, quantity, unit_price, transaction_date, status`
- Dedup rules:
  - Customers dedupes on `email`, products on `product_name`, sales on full-row duplicates.
- Date parsing:
  - Sales date accepts `order_date`, `transaction_date` or `date` and is normalized to `YYYY-MM-DD`.
  - Customer `registration_date` is normalized similarly.
- Phone formatting: `format_phone` normalizes to `+91-<10digits>` — note the repository applies Indian country code by default.

## Error handling & fallback behavior (key for debugging)
- If MySQL is unavailable or inserts fail, the script:
  - Writes CSVs to `part1-database-etl/fallback_output/` (customers_to_load.csv, etc.)
  - Attempts to create `fleximart_fallback.db` (SQLite) and insert tables
  - Captures `docker ps -a` and MySQL container logs where possible and saves them to the fallback dir
  - Writes `powershell_execution_policy.txt` (Windows-specific diagnostic)
- Inspect `etl.log` for detailed traces and `data_quality_report.txt` for processing metrics.

## Debugging tips & examples
- MySQL connection: script tries hosts in `MYSQL_HOSTS` (comma-separated). If auth issues mention `caching_sha2_password`, consider switching to `mysql_native_password` per the in-script SQL example.
- To inspect running containers/logs (PowerShell-safe examples in `README.md`):
  - `docker ps -a`
  - `docker logs <container_id>`

## Files & locations worth reviewing
- `part1-database-etl/etl_pipeline.py` — main logic (parsing, cleaning, DB load, fallback)
- `data/` — raw CSV inputs
- `part1-database-etl/fallback_output/` — fallback outputs when DB unavailable
- `README.md` / `RUN.md` — operational run & troubleshooting guidance

## Test & PR guidance for AI agents
- Avoid changing fallback behavior without reason — it's key for offline diagnostics.
- If adding transformations, include a dry-run demonstration and update `data_quality_report` expectations.
- When changing column names or dedup keys, update `ensure_columns` and add explicit examples in `README.md` showing expected input shapes.

If any of these areas are unclear or you want this file to include stricter rules (commit format, branch names, test targets), tell me which parts to expand or clarify. ✅
