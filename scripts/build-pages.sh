#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_root="$(cd "${script_dir}/.." && pwd)"
pages_output="${project_root}/dist-pages"

if [[ ! -f "${project_root}/package.json" ]]; then
  echo "Project root could not be validated." >&2
  exit 69
fi

cd "${project_root}"
npm run build

rm -rf "${pages_output}"
mkdir -p "${pages_output}"
cp -R "${project_root}/dist/client/." "${pages_output}/"

"${project_root}/node_modules/.bin/esbuild" \
  "${project_root}/dist/server/index.js" \
  --bundle \
  --format=esm \
  --platform=neutral \
  --target=es2022 \
  --external:cloudflare:workers \
  '--external:node:*' \
  --outfile="${pages_output}/_worker.js"

echo "Cloudflare Pages output prepared in dist-pages."
