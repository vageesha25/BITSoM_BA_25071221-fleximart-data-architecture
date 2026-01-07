# Fleximart ETL — Run & Troubleshooting Guide

This document contains recommended safe PowerShell commands and examples for running the ETL and diagnosing common issues.

## Activate virtual environment (PowerShell)
Temporarily allow script execution for this session and activate:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
. .\.venv\Scripts\Activate.ps1
```

Alternative without changing execution policy (one-liner):

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command ". .\.venv\Scripts\Activate.ps1"
```

Or use CMD (no policy issues):

```cmd
.\.venv\Scripts\activate.bat
```

Or WSL/Bash:

```bash
source .venv/bin/activate
```

---

## Docker commands (PowerShell-safe)
- List containers: (replace the placeholder with a real id or name — do NOT include `<` or `>`)

```powershell
docker ps -a
```

- Show logs for a container:

```powershell
docker logs CONTAINER_ID_OR_NAME
```

- Follow logs:

```powershell
docker logs -f CONTAINER_ID_OR_NAME
```

- Save logs to file (stdout+stderr) safely:

```powershell
docker logs CONTAINER_ID_OR_NAME 2>&1 | Out-File -FilePath "C:\path\to\logs.txt" -Encoding utf8
```

Note: The error "The ampersand (&) character is not allowed" usually occurs when a command containing `&` or unbalanced characters is pasted into PowerShell. Use the exact commands above and avoid embedding `&` without quoting.

---

## PowerShell execution policy diagnostics
To capture the system policy (the script also captures this automatically on fallback):

```powershell
Get-ExecutionPolicy -List
```

If you see blocking behavior, `RemoteSigned` for `CurrentUser` is a safe persistent option:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

---

## Run the ETL
- Dry run (no DB or file writes):

```powershell
python part1-database-etl/etl_pipeline.py --dry-run
```

- Normal run:

```powershell
python part1-database-etl/etl_pipeline.py
```

## Environment variables (recommended)
Set DB credentials in PowerShell before running (keeps secrets out of source code):

```powershell
$env:MYSQL_USER = "root"
$env:MYSQL_PASSWORD = "your_password"
$env:MYSQL_DB = "fleximart"
$env:MYSQL_HOSTS = "127.0.0.1,localhost"
$env:MYSQL_PORT = "3306"
```

These can also be put in a `.env` file at the repo root — the script will load it if `python-dotenv` is installed.

---

## Fallback diagnostics
If the script cannot connect to MySQL it will:
- write CSVs to `part1-database-etl/fallback_output/`
- write a fallback `data_quality_report.txt` there
- try to save Docker `ps -a` output and container logs into the same folder
- save PowerShell `Get-ExecutionPolicy -List` output to `part1-database-etl/fallback_output/powershell_execution_policy.txt`

Check `etl.log` for detailed messages.

---

If you want the same content as `RUN.md` placed somewhere else (or a shorter README), tell me where and I'll update it.

---

## Testing & Dry-run (quick smoke-test)
- Dry-run (no DB or file writes):

```powershell
python part1-database-etl/etl_pipeline.py --dry-run
```

This prints what the pipeline would do (counts and target paths) but does not modify the database or write files.

- Quick smoke test (validates parsing & basic logic):

```powershell
python part1-database-etl/etl_pipeline.py --dry-run
# then inspect etl.log and part1-database-etl/fallback_output/ if any diagnostics were logged
```

- Full run (writes outputs / attempts DB):

```powershell
python part1-database-etl/etl_pipeline.py
```

Use the dry-run first to confirm parsing and counts before running the full pipeline.