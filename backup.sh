#!/usr/bin/env bash
# Cópia de segurança da base de dados. Requer a CLI do Supabase e "supabase link" feito.
set -euo pipefail
mkdir -p backups
supabase db dump --linked -f "backups/bbs-$(date +%F).sql"
ls -1t backups | tail -n +15 | while read f; do rm -f "backups/$f"; done   # guarda as últimas 14
