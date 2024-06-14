#!/bin/bash

echo "Running injectVarEnv.sh script"
echo "API_URL: ${API_URL}"

# Find and replace placeholders
for file in $(find /usr/share/nginx/html/assets -name '*.js'); do
  echo "Processing $file"
  sed -i 's|__DOCKER_COMPOSE_API_URL__|'${API_URL}'|g' $file
  echo "Replaced in $file"
done

echo "Finished running injectVarEnv.sh script"

echo "Starting nginx"

nginx -g 'daemon off;'