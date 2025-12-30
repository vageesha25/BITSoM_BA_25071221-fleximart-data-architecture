print("ETL Pipeline started")

import pandas as pd
import numpy as np
import os
import mysql.connector
from datetime import datetime
import logging
import sys
import sqlite3
import time
import subprocess
import warnings

logging.basicConfig(
    filename="etl.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logging.info("ETL Pipeline started")

import argparse
parser = argparse.ArgumentParser(description="ETL pipeline for Fleximart")
parser.add_argument("--dry-run", action="store_true", help="Run without writing to DB or files")
parser.add_argument("--no-preflight", action="store_true", help="Skip automatic DB preflight checks")
args = parser.parse_args()
DRY_RUN = args.dry_run
NO_PREFLIGHT = args.no_preflight
if DRY_RUN:
    logging.info("Running in dry-run mode: no DB or file changes will be made")
    print("Dry-run: no DB or file changes will be made")

from pathlib import Path
# Build absolute data directory path relative to this script
script_dir = Path(__file__).resolve().parent
data_dir = (script_dir.parent / "data").resolve()
# Optionally load environment variables from .env if python-dotenv is installed
try:
    from dotenv import load_dotenv
    dotenv_path = script_dir.parent / '.env'
    if dotenv_path.exists():
        load_dotenv(dotenv_path=dotenv_path)
        logging.info(f"Loaded environment variables from {dotenv_path}")
except Exception:
    # python-dotenv not installed or .env missing — continue
    pass

def read_csv_safe(fname):
    path = data_dir / fname
    if not path.exists():
        logging.error(f"File not found: {path}")
        raise FileNotFoundError(f"CSV file not found: {path}")
    logging.info(f"Loading {path}")
    try:
        df = pd.read_csv(path)
        # If pandas parsed the whole line as a single column (happens when each row is
        # wrapped in quotes like "a,b,c") fall back to a more tolerant parser and
        # then strip surrounding quotes from column names and string values.
        if df.shape[1] == 1 and "," in df.columns[0]:
            logging.info("Detected single-column CSV; retrying with QUOTE_NONE and cleaning quotes")
            import csv
            df = pd.read_csv(path, sep=",", engine="python", quoting=csv.QUOTE_NONE)
            df.columns = [c.replace('"','').strip() for c in df.columns]
            for col in df.select_dtypes(include='object').columns:
                df[col] = df[col].astype(str).str.replace('"','').str.strip()
        # Normalize column names (strip + lowercase) for consistent downstream access
        df.columns = df.columns.str.strip().str.lower()
        return df
    except Exception as e:
        logging.exception(f"Failed to load CSV {path}: {e}")
        raise

customers_df = read_csv_safe("customers_raw.csv")
products_df  = read_csv_safe("products_raw.csv")
sales_df     = read_csv_safe("sales_raw.csv")

# Basic sanity checks, validation helpers and robust parsing
print(customers_df.head())
print(customers_df.info())

logging.info(f"Customers records read: {len(customers_df)}")
logging.info(f"Products records read: {len(products_df)}")
logging.info(f"Sales records read: {len(sales_df)}")

# Helpers
def ensure_columns(df, required_cols, df_name, default=pd.NA):
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        logging.warning(f"Missing columns in {df_name}: {missing}. Creating with default values.")
        for c in missing:
            df[c] = default
    # normalize strings for object columns
    for col in df.select_dtypes(include=['object']).columns:
        df[col] = df[col].astype('string')

def normalize_date_series(s):
    # try default parsing
    parsed = pd.to_datetime(s, errors='coerce')
    # if any unparsable and raw values contain '/', try dayfirst parsing for those
    if parsed.isna().any():
        try_dayfirst = s.astype(str).str.contains('/')
        if try_dayfirst.any():
            with warnings.catch_warnings():
                warnings.simplefilter("ignore", UserWarning)
                parsed_dayfirst = pd.to_datetime(s, dayfirst=True, errors='coerce')
            parsed = parsed.fillna(parsed_dayfirst)
    # return formatted strings (or NaN)
    return parsed.dt.strftime('%Y-%m-%d')


def generate_data_quality_report(path, metrics):
    """Write a human-readable data quality report to `path`.

    `metrics` is a dict with keys for customers/products/sales stats.
    """
    lines = []
    lines.append("ETL Data Quality Report")
    lines.append(f"Generated: {datetime.now().isoformat()}")
    lines.append("")
    for entity in ('customers', 'products', 'sales'):
        m = metrics.get(entity, {})
        lines.append(f"--- {entity.capitalize()} ---")
        lines.append(f"Initial records: {m.get('initial', 0)}")
        lines.append(f"Duplicates removed: {m.get('duplicates_removed', 0)}")
        mv = m.get('missing_values', {})
        for mv_name, mv_count in mv.items():
            lines.append(f"Missing {mv_name} removed: {mv_count}")
        if m.get('stock_filled') is not None:
            lines.append(f"Stock quantity filled: {m.get('stock_filled')}")
        lines.append(f"Final records: {m.get('final', 0)}")
        # loaded/exported
        lines.append(f"Loaded to MySQL: {m.get('loaded_mysql', 0)}")
        lines.append(f"Exported to CSV (fallback): {m.get('exported_csv', 0)}")
        lines.append(f"Inserted to SQLite fallback: {m.get('inserted_sqlite', 0)}")
        lines.append("")
    # totals
    totals = metrics.get('totals', {})
    lines.append("--- Summary ---")
    lines.append(f"Total records processed: {totals.get('processed', 0)}")
    lines.append(f"Total loaded to MySQL: {totals.get('loaded_mysql', 0)}")
    lines.append(f"Total exported to CSV: {totals.get('exported_csv', 0)}")
    lines.append(f"Total inserted to SQLite: {totals.get('inserted_sqlite', 0)}")
    lines.append("")

    # Write file
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text("\n".join(lines), encoding='utf-8')
    logging.info(f"Wrote data quality report to {p}")


def preflight_check(hosts, user, password, database, port=3306, timeout=3, out_path=None):
    """Run a lightweight connectivity check and write a small preflight report.

    Returns True if any host accepted a connection, False otherwise.
    """
    report_lines = []
    report_lines.append(f"Preflight check generated: {datetime.now().isoformat()}")
    env_issues = []
    if not user:
        env_issues.append('MYSQL_USER is empty')
    if not password:
        env_issues.append('MYSQL_PASSWORD is empty')
    if not database:
        env_issues.append('MYSQL_DB is empty')
    if env_issues:
        report_lines.append('Environment issues detected:')
        report_lines.extend([f" - {i}" for i in env_issues])

    success = False
    host_errors = []
    for h in hosts:
        try:
            conn = mysql.connector.connect(host=h, user=user, password=password, database=database, port=port, connection_timeout=timeout)
            conn.close()
            report_lines.append(f"SUCCESS: Connected to {h}:{port}")
            logging.info(f"Preflight: connected to {h}:{port}")
            success = True
        except Exception as e:
            msg = f"FAIL: {h}:{port} -> {e}"
            report_lines.append(msg)
            host_errors.append(msg)
            logging.info("Preflight connection attempt failed: " + str(e))

    if not success:
        report_lines.append("")
        report_lines.append("Suggestions:")
        report_lines.append(" - Verify MYSQL_* env vars (MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB, MYSQL_HOSTS)")
        report_lines.append(" - If using Docker, run: docker ps -a and docker logs <container_id>")
        report_lines.append(" - On Windows check: Get-Service -Name MySQL* ; Test-NetConnection -ComputerName 127.0.0.1 -Port 3306")

    if out_path:
        try:
            p = Path(out_path)
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text("\n".join(report_lines), encoding='utf-8')
            logging.info(f"Wrote preflight report to {p}")
        except Exception as e:
            logging.info(f"Failed to write preflight report to {out_path}: {e}")

    return success


# Ensure required columns exist (create if necessary)
ensure_columns(customers_df, ['customer_id','first_name','last_name','email','phone','city','registration_date'], 'customers')
ensure_columns(products_df, ['product_id','product_name','category','price','stock_quantity'], 'products')
ensure_columns(sales_df, ['transaction_id','customer_id','product_id','quantity','unit_price','transaction_date','status'], 'sales')

# Normalize textual columns
customers_df.columns = customers_df.columns.str.strip().str.lower()
products_df.columns = products_df.columns.str.strip().str.lower()
sales_df.columns = sales_df.columns.str.strip().str.lower()

# Record initial counts and data-quality metrics
customers_initial_count = len(customers_df)
products_initial_count = len(products_df)
sales_initial_count = len(sales_df)

# Duplicates before cleaning
customers_dup_before = int(customers_df.duplicated(subset=['email']).sum()) if 'email' in customers_df.columns else 0
products_dup_before = int(products_df.duplicated(subset=['product_name']).sum()) if 'product_name' in products_df.columns else 0
sales_dup_before = int(sales_df.duplicated().sum())

# Missing values before cleaning (critical fields)
customers_missing_email_before = int(customers_df['email'].isna().sum()) if 'email' in customers_df.columns else 0
products_missing_price_before = int(products_df['price'].isna().sum()) if 'price' in products_df.columns else 0
products_missing_stock_before = int(products_df['stock_quantity'].isna().sum()) if 'stock_quantity' in products_df.columns else 0
sales_missing_customer_before = int(sales_df['customer_id'].isna().sum()) if 'customer_id' in sales_df.columns else 0
sales_missing_product_before = int(sales_df['product_id'].isna().sum()) if 'product_id' in sales_df.columns else 0

# Initialize load/export counters
customers_inserted = products_inserted = sales_inserted = orders_inserted = order_items_inserted = 0
customers_exported = products_exported = sales_exported = 0
customers_sqlite = products_sqlite = sales_sqlite = 0

# Deduplicate and record removals
# Customers
before = len(customers_df)
if 'email' in customers_df.columns:
    customers_df.drop_duplicates(subset=['email'], inplace=True)
customers_duplicates_removed = before - len(customers_df)

# Products
before = len(products_df)
if 'product_name' in products_df.columns:
    products_df.drop_duplicates(subset=['product_name'], inplace=True)
products_duplicates_removed = before - len(products_df)

# Sales
before = len(sales_df)
sales_df.drop_duplicates(inplace=True)
sales_duplicates_removed = before - len(sales_df)

# Drop rows missing critical ids and record removals
# Customers - email
before = len(customers_df)
if 'email' in customers_df.columns:
    customers_df.dropna(subset=['email'], inplace=True)
customers_missing_email_removed = before - len(customers_df)

# Products - price
before = len(products_df)
if 'price' in products_df.columns:
    products_df['price'] = pd.to_numeric(products_df['price'], errors='coerce')
    products_df.dropna(subset=['price'], inplace=True)
    products_missing_price_removed = before - len(products_df)
else:
    products_df['price'] = pd.NA
    products_missing_price_removed = 0

# Products - stock_quantity fill
products_stock_filled = 0
if 'stock_quantity' in products_df.columns:
    missing_before = int(products_df['stock_quantity'].isna().sum())
    products_df['stock_quantity'] = pd.to_numeric(products_df['stock_quantity'], errors='coerce').fillna(0).astype(int)
    products_stock_filled = missing_before
else:
    products_df['stock_quantity'] = 0

# Sales - customer_id & product_id
before = len(sales_df)
if 'customer_id' in sales_df.columns and 'product_id' in sales_df.columns:
    sales_df.dropna(subset=['customer_id','product_id'], inplace=True)
sales_missing_ids_removed = before - len(sales_df)

# Normalize phone column safely
def format_phone(phone):
    if pd.isna(phone) or phone is None:
        return None
    digits = ''.join(filter(str.isdigit, str(phone)))
    if not digits:
        return None
    return f"+91-{digits[-10:]}"
if 'phone' in customers_df.columns:
    customers_df['phone'] = customers_df['phone'].apply(format_phone)
else:
    customers_df['phone'] = pd.NA

# Normalize category
if 'category' in products_df.columns:
    products_df['category'] = (
        products_df['category']
        .astype('string')
        .str.strip()
        .str.lower()
        .str.title()
    )
else:
    products_df['category'] = pd.NA

# Normalize and coerce sales date (try multiple formats)
date_candidates = [c for c in ['order_date','transaction_date','date'] if c in sales_df.columns]
if date_candidates:
    col = date_candidates[0]
    before_date = len(sales_df)
    sales_df['order_date'] = normalize_date_series(sales_df[col])
    unparsable_before = sales_df['order_date'].isna().sum()
    sales_df.dropna(subset=['order_date'], inplace=True)
    sales_date_unparsable_removed = before_date - len(sales_df)
    logging.info(f"Parsed sales dates from column: {col}; unparsable before: {unparsable_before}; removed: {sales_date_unparsable_removed}")
else:
    logging.error(f"No recognizable date column in sales: {list(sales_df.columns)}")
    raise KeyError("No recognizable date column found in sales data")

# Normalize customer registration_date as well
if 'registration_date' in customers_df.columns:
    customers_df['registration_date'] = normalize_date_series(customers_df['registration_date'])
    logging.info(f"Parsed customer registration dates; unparsable count: {customers_df['registration_date'].isna().sum()}")
else:
    customers_df['registration_date'] = pd.NA

# Detect and normalize sales date column (accept common names like transaction_date)
possible_date_cols = ["order_date", "transaction_date", "date"]
found_date_col = None
for col in possible_date_cols:
    if col in sales_df.columns:
        found_date_col = col
        break
if found_date_col is None:
    logging.error(f"No date column found in sales data. Available columns: {list(sales_df.columns)}")
    raise KeyError("No date column in sales data; expected one of: " + ", ".join(possible_date_cols))
logging.info(f"Using sales date column: {found_date_col}")
sales_df["order_date"] = pd.to_datetime(sales_df[found_date_col], errors="coerce").dt.strftime("%Y-%m-%d")
sales_df.dropna(subset=["order_date"], inplace=True)

if DRY_RUN:
    logging.info("Dry-run: skipping DB and filesystem writes. Summarizing actions:")
    print("Dry-run mode: operations that would modify DB or files are skipped.")
    print(f"Would connect to MySQL at localhost:3306 and insert {len(customers_df)} customers, {len(products_df)} products, and {len(sales_df)} sales.")
    print(f"Would write data_quality_report to: {script_dir.parent / 'data_quality_report.txt'} (skipped)")
    print(f"Would create fallback directory and write CSVs to: {script_dir / 'fallback_output'} (skipped)")
    print(f"Would create SQLite fallback DB at: {script_dir.parent / 'fleximart_fallback.db'} (skipped)")
    logging.info("Dry-run completed; no changes made.")
else:
    def _docker_logs_for_container(container_id, out_dir=None):
        # Safely fetch docker logs for a specific container (no shell, validates id)
        if not container_id or '<' in container_id or '>' in container_id or '&' in container_id:
            logging.info(f"Skipping invalid container id/name: {container_id}")
            return None
        try:
            res = subprocess.run(["docker", "logs", container_id], capture_output=True, text=True, timeout=10)
            stdout = res.stdout or ""
            # Log only a prefix to avoid huge logs in the main log file
            logging.info(f"docker logs {container_id} output (first 1000 chars):\n{stdout[:1000]}")
            if out_dir:
                out_dir = Path(out_dir)
                out_dir.mkdir(parents=True, exist_ok=True)
                (out_dir / f"docker_logs_{container_id}.txt").write_text(stdout, encoding='utf-8')
            return stdout
        except Exception as e:
            logging.info(f"docker logs failed for {container_id}: {e}")
            return None

    def _capture_powershell_execution_policy(fallback_dir=None):
        try:
            # Run Get-ExecutionPolicy -List safely (no shell interpolation)
            res = subprocess.run(["powershell", "-NoProfile", "-Command", "Get-ExecutionPolicy -List"], capture_output=True, text=True, timeout=5)
            out = res.stdout or res.stderr or "(no output)"
            logging.info("Get-ExecutionPolicy output:\n" + out)
            if fallback_dir:
                Path(fallback_dir).mkdir(parents=True, exist_ok=True)
                (Path(fallback_dir) / "powershell_execution_policy.txt").write_text(out, encoding='utf-8')
            return out
        except Exception as e:
            logging.info(f"Failed to capture PowerShell execution policy: {e}")
            return None

    def _log_docker_ps(fallback_dir=None):
        try:
            # Use format to get ID, Image and Names in a predictable way
            res = subprocess.run(["docker", "ps", "-a", "--format", "{{.ID}} {{.Image}} {{.Names}}"], capture_output=True, text=True, timeout=5)
            out = res.stdout or "(no output)"
            logging.info("docker ps -a output:\n" + out)
            if fallback_dir:
                Path(fallback_dir).mkdir(parents=True, exist_ok=True)
                (Path(fallback_dir) / "docker_ps_a.txt").write_text(out, encoding='utf-8')
            # Auto-capture logs for likely MySQL containers
            for line in out.splitlines():
                parts = line.split()
                if not parts:
                    continue
                cid = parts[0]
                image = parts[1] if len(parts) > 1 else ""
                name = parts[2] if len(parts) > 2 else ""
                if any(k in image.lower() or k in name.lower() for k in ("mysql", "mariadb")):
                    _docker_logs_for_container(cid, out_dir=fallback_dir)
        except Exception as e:
            logging.info(f"docker ps not available or failed: {e}")

    def connect_mysql_with_retries(user, password, database, hosts=("127.0.0.1", "localhost"), port=3306, retries=3, delay=3, timeout=5):
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
        # Diagnostics & suggestions
        _log_docker_ps()
        msg = str(getattr(last_err, 'msg', last_err)).lower()
        if 'caching_sha2_password' in msg or 'auth' in msg:
            logging.info("Authentication issue detected. Consider running the following SQL as an admin to change auth plugin:\nALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';\nFLUSH PRIVILEGES;")
        logging.info("Suggested system checks: \n - On Windows: Get-Service -Name MySQL* ; netstat -ano | findstr 3306 ; Test-NetConnection -ComputerName 127.0.0.1 -Port 3306\n - If using Docker: run 'docker ps -a' and 'docker logs <container_id>' to inspect the container")
        return None

    # Read DB credentials and connection settings from environment variables (safer than hard-coding)
    DB_USER = os.getenv('MYSQL_USER', 'root')
    DB_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
    DB_NAME = os.getenv('MYSQL_DB', 'fleximart')
    DB_HOSTS = os.getenv('MYSQL_HOSTS', '127.0.0.1,localhost').split(',')
    try:
        DB_PORT = int(os.getenv('MYSQL_PORT', '3306'))
    except ValueError:
        DB_PORT = 3306
    try:
        DB_RETRIES = int(os.getenv('MYSQL_RETRIES', '3'))
    except ValueError:
        DB_RETRIES = 3
    try:
        DB_DELAY = int(os.getenv('MYSQL_DELAY', '3'))
    except ValueError:
        DB_DELAY = 3
    try:
        DB_TIMEOUT = int(os.getenv('MYSQL_TIMEOUT', '5'))
    except ValueError:
        DB_TIMEOUT = 5

    logging.info(f"DB settings: host(s)={DB_HOSTS}, user={DB_USER}, db={DB_NAME}, port={DB_PORT}, retries={DB_RETRIES}")

    # Run an automated preflight connectivity check (unless user requested to skip it)
    if not NO_PREFLIGHT:
        logging.info("Running preflight DB connectivity check")
        preflight_ok = preflight_check(hosts=DB_HOSTS, user=DB_USER, password=DB_PASSWORD, database=DB_NAME, port=DB_PORT, timeout=3, out_path=script_dir / 'preflight_report.txt')
        if preflight_ok:
            logging.info("Preflight: MySQL reachable — continuing with ETL")
        else:
            logging.warning("Preflight: MySQL not reachable from this environment. The ETL will still attempt to connect and will perform fallback behavior if needed. See preflight_report.txt for details.")
            print("Preflight warning: database not reachable. Check 'part1-database-etl/preflight_report.txt' for details and suggestions.")
    else:
        logging.info("Skipping preflight by user request (--no-preflight)")
    if not DB_PASSWORD:
        logging.warning("MYSQL_PASSWORD is empty. Connection may fail if the user requires a password.")

    def do_fallback():
        logging.error("Performing fallback: write CSVs and attempt SQLite backup")
        fallback_dir = script_dir / "fallback_output"
        fallback_dir.mkdir(exist_ok=True)
        customers_df.to_csv(fallback_dir / "customers_to_load.csv", index=False)
        products_df.to_csv(fallback_dir / "products_to_load.csv", index=False)
        sales_df.to_csv(fallback_dir / "sales_to_load.csv", index=False)
        logging.info(f"Dataframes written to {fallback_dir}")

        # exported counts
        customers_exported_local = len(customers_df)
        products_exported_local = len(products_df)
        sales_exported_local = len(sales_df)

        # capture docker diagnostics and powershell execution policy outputs
        try:
            _log_docker_ps(fallback_dir=fallback_dir)
        except Exception:
            logging.info("Failed to capture docker diagnostics")
        try:
            _capture_powershell_execution_policy(fallback_dir=fallback_dir)
        except Exception:
            logging.info("Failed to capture PowerShell execution policy")

        customers_sqlite_local = products_sqlite_local = sales_sqlite_local = 0
        try:
            sqlite_db = script_dir.parent / "fleximart_fallback.db"
            sqlite_conn = sqlite3.connect(sqlite_db)
            customers_df.to_sql("customers", sqlite_conn, if_exists="replace", index=False)
            products_df.to_sql("products", sqlite_conn, if_exists="replace", index=False)
            sales_df.to_sql("sales", sqlite_conn, if_exists="replace", index=False)
            sqlite_conn.close()
            customers_sqlite_local = len(customers_df)
            products_sqlite_local = len(products_df)
            sales_sqlite_local = len(sales_df)
            logging.info(f"Inserted data into SQLite fallback DB at {sqlite_db}")
            logging.info("ETL Pipeline completed with SQLite fallback")
        except Exception as e2:
            logging.exception(f"SQLite fallback failed: {e2}")
            print("SQLite fallback failed. Data written only to CSVs.")
            logging.info("ETL Pipeline completed with CSV fallback only")

        # Build metrics and write report in fallback directory
        metrics = {
            'customers': {
                'initial': customers_initial_count,
                'duplicates_removed': customers_duplicates_removed,
                'missing_values': {'email': customers_missing_email_removed},
                'final': len(customers_df),
                'loaded_mysql': 0,
                'exported_csv': customers_exported_local,
                'inserted_sqlite': customers_sqlite_local,
            },
            'products': {
                'initial': products_initial_count,
                'duplicates_removed': products_duplicates_removed,
                'missing_values': {'price': products_missing_price_removed},
                'stock_filled': products_stock_filled,
                'final': len(products_df),
                'loaded_mysql': 0,
                'exported_csv': products_exported_local,
                'inserted_sqlite': products_sqlite_local,
            },
            'sales': {
                'initial': sales_initial_count,
                'duplicates_removed': sales_duplicates_removed,
                'missing_values': {'customer_id_missing': sales_missing_ids_removed},
                'date_unparsable_removed': sales_date_unparsable_removed if 'sales_date_unparsable_removed' in globals() or 'sales_date_unparsable_removed' in locals() else 0,
                'final': len(sales_df),
                'loaded_mysql': 0,
                'exported_csv': sales_exported_local,
                'inserted_sqlite': sales_sqlite_local,
            },
            'totals': {
                'processed': customers_initial_count + products_initial_count + sales_initial_count,
                'loaded_mysql': 0,
                'exported_csv': customers_exported_local + products_exported_local + sales_exported_local,
                'inserted_sqlite': customers_sqlite_local + products_sqlite_local + sales_sqlite_local,
            }
        }
        report_path = fallback_dir / "data_quality_report.txt"
        generate_data_quality_report(report_path, metrics)
        logging.info(f"Wrote fallback data quality report to {report_path}")

    conn = connect_mysql_with_retries(user=DB_USER, password=DB_PASSWORD, database=DB_NAME, hosts=DB_HOSTS, port=DB_PORT, retries=DB_RETRIES, delay=DB_DELAY, timeout=DB_TIMEOUT)

    if conn:
        try:
            cursor = conn.cursor()

            # Customers
            if len(customers_df) > 0:
                # Select the exact columns to load (keeps ordering explicit)
                customers_load_df = customers_df[["first_name", "last_name", "email", "phone", "city", "registration_date"]].copy()

                # Remove duplicates within the batch (primary dedupe on email)
                if 'email' in customers_load_df.columns:
                    before_count = len(customers_load_df)
                    customers_load_df.drop_duplicates(subset=['email'], inplace=True)
                    after_count = len(customers_load_df)
                    logging.info(f"Customer batch dedup: removed {before_count - after_count} duplicate rows based on email")

                # Try to avoid inserting rows that already exist in the DB (by email)
                to_insert_df = customers_load_df
                try:
                    cursor.execute("SELECT email FROM customers")
                    existing_emails = set(row[0] for row in cursor.fetchall() if row[0])
                    if existing_emails:
                        mask = ~to_insert_df['email'].isin(existing_emails)
                        skipped_df = to_insert_df[~mask]
                        to_insert_df = to_insert_df[mask]
                        if not skipped_df.empty:
                            logging.info(f"Skipped {len(skipped_df)} customers already present in DB (by email)")
                except Exception as e:
                    logging.info(f"Could not fetch existing customer emails for dedup check: {e}")

                # Prepare and execute insert using provided SQL snippet
                customers_records = to_insert_df.values.tolist()
                if customers_records:
                    customer_insert_sql = """
INSERT INTO customers
(first_name, last_name, email, phone, city, registration_date)
VALUES (%s, %s, %s, %s, %s, %s)
"""
                    cursor.executemany(customer_insert_sql, customers_records)
                    customers_inserted = len(customers_records)
                    logging.info(f"Inserted {customers_inserted} customer records")
                else:
                    logging.info("No new customer records to insert after deduplication")

            # Products
            if len(products_df) > 0:
                products_df['price'] = pd.to_numeric(products_df['price'], errors='coerce')
                products_df['stock_quantity'] = pd.to_numeric(products_df['stock_quantity'], errors='coerce').fillna(0).astype(int)

                # Use explicit load columns (note: product_id may be absent/ignored here if DB assigns one)
                products_load_df = products_df[["product_name", "category", "price", "stock_quantity"]].copy()

                # Remove duplicates within the batch based on product_name
                before_count = len(products_load_df)
                products_load_df.drop_duplicates(subset=['product_name'], inplace=True)
                after_count = len(products_load_df)
                logging.info(f"Product batch dedup: removed {before_count - after_count} duplicate rows based on product_name")

                # Skip products that already exist in DB (by product_name)
                to_insert_products = products_load_df
                try:
                    cursor.execute("SELECT product_name FROM products")
                    existing_products = set(row[0] for row in cursor.fetchall() if row[0])
                    if existing_products:
                        mask = ~to_insert_products['product_name'].isin(existing_products)
                        skipped = to_insert_products[~mask]
                        to_insert_products = to_insert_products[mask]
                        if not skipped.empty:
                            logging.info(f"Skipped {len(skipped)} products already present in DB (by product_name)")
                except Exception as e:
                    logging.info(f"Could not fetch existing product names for dedup check: {e}")

                # Insert remaining products
                products_records = to_insert_products.values.tolist()
                if products_records:
                    product_insert_sql = """INSERT INTO products (product_name, category, price, stock_quantity) VALUES (%s, %s, %s, %s)"""
                    cursor.executemany(product_insert_sql, products_records)
                    products_inserted = len(products_records)
                    logging.info(f"Inserted {products_inserted} product records")
                else:
                    logging.info("No new product records to insert after deduplication")

            # Sales => convert to Orders + Order Items
            if len(sales_df) > 0:
                # Ensure numeric columns
                sales_df['quantity'] = pd.to_numeric(sales_df['quantity'], errors='coerce').fillna(0).astype(int)
                sales_df['unit_price'] = pd.to_numeric(sales_df.get('unit_price', pd.Series(0)), errors='coerce').fillna(0.0)
                sales_df['line_total'] = sales_df['quantity'] * sales_df['unit_price']

                # Build orders (one per customer_id + order_date) with total_amount
                orders_df = (
                    sales_df.groupby(['customer_id', 'order_date'], as_index=False)
                    .agg(total_amount=('line_total', 'sum'))
                )
                orders_df.drop_duplicates(subset=['customer_id', 'order_date'], inplace=True)

                # Skip orders that already exist in DB
                to_insert_orders = orders_df.copy()
                try:
                    cursor.execute("SELECT customer_id, order_date FROM orders")
                    existing_orders = set((row[0], str(row[1])) for row in cursor.fetchall())
                    # normalize order_date for comparison
                    to_insert_orders['order_date'] = to_insert_orders['order_date'].astype(str)
                    mask = ~to_insert_orders.apply(lambda r: (r['customer_id'], r['order_date']) in existing_orders, axis=1)
                    skipped_orders = to_insert_orders[~mask]
                    to_insert_orders = to_insert_orders[mask]
                    if not skipped_orders.empty:
                        logging.info(f"Skipped {len(skipped_orders)} orders already present in DB (by customer_id+order_date)")
                except Exception as e:
                    logging.info(f"Could not fetch existing orders for dedup check: {e}")

                # Insert new orders
                orders_records = to_insert_orders[['customer_id', 'order_date', 'total_amount']].values.tolist()
                if orders_records:
                    order_insert_sql = """INSERT INTO orders (customer_id, order_date, total_amount) VALUES (%s, %s, %s)"""
                    cursor.executemany(order_insert_sql, orders_records)
                    orders_inserted = len(orders_records)
                    logging.info(f"Inserted {orders_inserted} orders")
                else:
                    logging.info("No new orders to insert after deduplication")

                # Build order lookup mapping from DB (order_id, customer_id, order_date)
                cursor.execute("SELECT order_id, customer_id, order_date FROM orders")
                orders_map = cursor.fetchall()
                order_lookup = {
                    (cust_id, str(order_date)): order_id
                    for order_id, cust_id, order_date in orders_map
                }

                # Build order_items records for every sales row that maps to an order
                order_items_records = []
                for _, row in sales_df.iterrows():
                    key = (row['customer_id'], str(row['order_date']))
                    if key not in order_lookup:
                        logging.warning(f"No order found for customer {row['customer_id']} on {row['order_date']}; skipping order_item")
                        continue
                    order_id = order_lookup[key]
                    try:
                        qty = int(row['quantity'])
                        up = float(row['unit_price'])
                    except Exception:
                        qty = 0
                        up = 0.0
                    subtotal = qty * up
                    order_items_records.append((order_id, row.get('product_id'), qty, up, subtotal))

                # Insert order_items
                if order_items_records:
                    order_item_insert_sql = """INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES (%s, %s, %s, %s, %s)"""
                    cursor.executemany(order_item_insert_sql, order_items_records)
                    order_items_inserted = len(order_items_records)
                    sales_inserted = order_items_inserted
                    logging.info(f"Inserted {order_items_inserted} order_items (sales rows)")
                else:
                    logging.info("No order_items to insert")

            conn.commit()

            # Build metrics dict and write detailed data quality report
            metrics = {
                'customers': {
                    'initial': customers_initial_count,
                    'duplicates_removed': customers_duplicates_removed,
                    'missing_values': {'email': customers_missing_email_removed},
                    'final': len(customers_df),
                    'loaded_mysql': customers_inserted,
                    'exported_csv': customers_exported,
                    'inserted_sqlite': customers_sqlite,
                },
                'products': {
                    'initial': products_initial_count,
                    'duplicates_removed': products_duplicates_removed,
                    'missing_values': {'price': products_missing_price_removed},
                    'stock_filled': products_stock_filled,
                    'final': len(products_df),
                    'loaded_mysql': products_inserted,
                    'exported_csv': products_exported,
                    'inserted_sqlite': products_sqlite,
                },
                'sales': {
                    'initial': sales_initial_count,
                    'duplicates_removed': sales_duplicates_removed,
                    'missing_values': {'customer_id_missing': sales_missing_ids_removed, 'product_id_missing': 0},
                    'date_unparsable_removed': sales_date_unparsable_removed if 'sales_date_unparsable_removed' in globals() or 'sales_date_unparsable_removed' in locals() else 0,
                    'final': len(sales_df),
                    'loaded_mysql': sales_inserted,
                    'exported_csv': sales_exported,
                    'inserted_sqlite': sales_sqlite,
                },
                'totals': {
                    'processed': customers_initial_count + products_initial_count + sales_initial_count,
                    'loaded_mysql': (customers_inserted if 'customers_inserted' in locals() else 0) + (products_inserted if 'products_inserted' in locals() else 0) + (sales_inserted if 'sales_inserted' in locals() else 0),
                    'exported_csv': (customers_exported if 'customers_exported' in locals() else 0) + (products_exported if 'products_exported' in locals() else 0) + (sales_exported if 'sales_exported' in locals() else 0),
                    'inserted_sqlite': (customers_sqlite if 'customers_sqlite' in locals() else 0) + (products_sqlite if 'products_sqlite' in locals() else 0) + (sales_sqlite if 'sales_sqlite' in locals() else 0),
                }
            }
            report_path = script_dir.parent / "data_quality_report.txt"
            generate_data_quality_report(report_path, metrics)
            logging.info("ETL Pipeline completed successfully (MySQL)")
        except mysql.connector.Error as err:
            logging.exception(f"MySQL insert failed: {err}")
            do_fallback()
        finally:
            try:
                cursor.close()
            except Exception:
                pass
            conn.close()
    else:
        logging.error("MySQL unavailable — writing CSV fallbacks and attempting SQLite fallback.")
        do_fallback()

# Helpful SQL commands (for manual troubleshooting):
# SHOW DATABASES;
# CREATE DATABASE fleximart;  -- if needed
# To change authentication plugin (run as admin/root in MySQL):
# ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
# FLUSH PRIVILEGES;
# To activate virtual environment on Windows, run: .\.venv\Scripts\activate.bat

# (Removed redundant manual insert/report block. All DB writes, reporting and cleanup
# are handled inside the MySQL-success branch above and the fallback handlers.)



