#!/bin/bash
set -euo pipefail

/opt/mssql-tools18/bin/sqlcmd \
  -S "${MSSQL_HOST:-db}" \
  -U sa \
  -P "${MSSQL_SA_PASSWORD}" \
  -C \
  -i /init/01-create-database.sql
