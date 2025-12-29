#!/bin/bash

# Upload environment variables to Vercel
# Usage: ./upload-env-to-vercel.sh <environment> <env-file>
# Example: ./upload-env-to-vercel.sh preview .env.staging

set -e

ENVIRONMENT=${1:-preview}
ENV_FILE=${2:-.env.staging}

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: Environment file $ENV_FILE not found"
  exit 1
fi

echo "Uploading environment variables from $ENV_FILE to Vercel ($ENVIRONMENT environment)..."

while IFS='=' read -r key value; do
  # Skip comments and empty lines
  if [[ "$key" =~ ^# ]] || [[ -z "$key" ]]; then
    continue
  fi

  # Clean up the value (remove quotes and trailing newlines)
  clean_value=$(echo "$value" | sed 's/^"//' | sed 's/"$//' | tr -d '\n')

  echo "Setting $key..."
  echo "$clean_value" | vercel env add "$key" "$ENVIRONMENT" 2>&1 | grep -v "already exists" || true

done < "$ENV_FILE"

echo "Environment variables uploaded successfully!"
