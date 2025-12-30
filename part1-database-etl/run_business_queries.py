"""Run business SQL queries and export results.

This script reads `business_queries.sql`, executes its SELECT queries against the
configured MySQL database, and writes CSV reports to `part1-database-etl/reports/`.

Usage examples:
  python part1-database-etl/run_business_queries.py --query-file part1-database-etl/business_queries.sql
  python part1-database-etl/run_business_queries.py --query-file part1-database-etl/business_queries.sql --output part1-database-etl/reports/customer_purchase_history.csv

Environment variables (same as ETL): MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB, MYSQL_HOSTS, MYSQL_PORT
"""

import os
import argparse
import time
import logging
from pathlib import Path
import mysql.connector
import pandas as pd

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def connect_mysql_with_retries(user, password, database, hosts=("127.0.0.1", "localhost"), port=3306, retries=3, delay=2, timeout=5):
    last_err = None
    for host in hosts:
        for attempt in range(1, retries + 1):
            try:
                logging.info(f"Attempting MySQL connection to {host}:{port} (attempt {attempt})")
                conn = mysql.connector.connect(host=host, user=user, password=password, database=database, port=port, connection_timeout=timeout)
                logging.info(f"MySQL connection established to {host}:{port}")
                return conn
            except mysql.connector.Error as err:
                last_err = err
                logging.warning(f"MySQL connect failed to {host}:{port} (attempt {attempt}): {err}")
                time.sleep(delay)
    logging.error(f"MySQL connection failed after {retries} attempts per host. Last error: {last_err}")
    return None


def main():
    parser = argparse.ArgumentParser(description='Run business SQL queries and export results')
    parser.add_argument('--query-file', required=True, help='Path to SQL file containing SELECT queries')
    parser.add_argument('--output', help='Output CSV path (defaults to reports/<first_select_name>.csv)')
    args = parser.parse_args()

    sql_path = Path(args.query_file)
    if not sql_path.exists():
        logging.error(f"SQL file not found: {sql_path}")
        raise SystemExit(1)

    sql_text = sql_path.read_text(encoding='utf-8')

    # DB connection settings from environment (same naming as ETL)
    DB_USER = os.getenv('MYSQL_USER', 'root')
    DB_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
    DB_NAME = os.getenv('MYSQL_DB', 'fleximart')
    DB_HOSTS = os.getenv('MYSQL_HOSTS', '127.0.0.1,localhost').split(',')
    try:
        DB_PORT = int(os.getenv('MYSQL_PORT', '3306'))
    except ValueError:
        DB_PORT = 3306

    conn = connect_mysql_with_retries(user=DB_USER, password=DB_PASSWORD, database=DB_NAME, hosts=DB_HOSTS, port=DB_PORT)
    if conn is None:
        # Give clearer, actionable guidance to the user when connection fails
        logging.error('Could not connect to MySQL. Exiting.')
        if not DB_PASSWORD:
            logging.error('Hint: MYSQL_PASSWORD environment variable appears empty. Set it before running the script. Example (PowerShell):')
            logging.error("$env:MYSQL_PASSWORD = 'your_password'")
        logging.error('Confirm MySQL is running and reachable (e.g., `docker ps -a` or Test-NetConnection to port 3306).')
        logging.error('If you see access-denied errors in etl.log, verify credentials and auth plugin (see README.md)')
        raise SystemExit(2)

    try:
        # Use pandas to read SQL directly (handles single SELECT well). If the file contains multiple statements,
        # split on ';' and execute the first SELECT found.
        # Simple heuristic: find first keyword 'select' (case-insensitive) and pass that chunk.
        txt_lower = sql_text.lower()
        idx = txt_lower.find('select')
        if idx == -1:
            logging.error('No SELECT statement found in SQL file')
            raise SystemExit(1)
        # Attempt to extract until the matching semicolon after the select, otherwise use whole file
        semicolon_idx = sql_text.find(';', idx)
        query = sql_text[idx:(semicolon_idx if semicolon_idx != -1 else None)]

        logging.info('Executing query from file')
        df = pd.read_sql(query, conn)

        reports_dir = Path(__file__).resolve().parent / 'reports'
        reports_dir.mkdir(parents=True, exist_ok=True)

        if args.output:
            out_path = Path(args.output)
        else:
            # default filename derived from SQL filename
            base = sql_path.stem
            out_path = reports_dir / f"{base}_report.csv"

        df.to_csv(out_path, index=False, encoding='utf-8')
        logging.info(f'Wrote query result to {out_path} ({len(df)} rows)')

    except Exception as e:
        logging.exception(f'Error running query: {e}')
        raise
    finally:
        try:
            conn.close()
        except Exception:
            pass


if __name__ == '__main__':
    main()
