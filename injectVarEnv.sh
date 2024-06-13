#!/bin/bash

# Replace placeholders in JavaScript files
find /usr/share/nginx/html/assets -name '*.js' -exec sed -i 's|__VITE_API_URL__|'${VITE_API_URL}'|g' {} \;
find /usr/share/nginx/html/assets -name '*.js' -exec sed -i 's|__VITE_RADARR_URL__|'${VITE_RADARR_URL}'|g' {} \;