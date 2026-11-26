#!/usr/bin/env bash
# Stamp a build version (busts phone caches of model files) and deploy to Cloudflare Pages.
# Needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID.
set -euo pipefail
cd "$(dirname "$0")/.."
V="$(git rev-parse --short HEAD)-$(date +%s)"
printf "// stamped by tools/deploy.sh so phones never mix old model files with new code\nexport const V = '%s';\n" "$V" > public/js/version.js
npx --yes wrangler@3 pages deploy public --project-name stress-punch --branch main --commit-dirty=true
git checkout -- public/js/version.js 2>/dev/null || true
echo "deployed version $V"
