#!/bin/bash

# Replace placeholders in JavaScript files
find /usr/share/nginx/html/assets -name '*.js' -exec sed -i 's|__DOCKER_COMPOSE_API_URL__|'${API_URL}'|g' {} \;
find /usr/share/nginx/html/assets -name '*.js' -exec sed -i 's|__DOCKER_COMPOSE_RADARR_URL__|'${RADARR_URL}'|g' {} \;