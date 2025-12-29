#!/bin/bash

# Create OAuth 2.0 Clients for Becoming Diamond
# Project: becoming-diamond-master
# Project Number: 307181021676

set -e

PROJECT_ID="becoming-diamond-master"
PROJECT_NUMBER="307181021676"

echo "Creating OAuth 2.0 clients for project: $PROJECT_ID"
echo "Project Number: $PROJECT_NUMBER"
echo ""

# Production OAuth Client
echo "Creating Production OAuth Client..."
gcloud alpha iap oauth-clients create \
  projects/$PROJECT_NUMBER/brands/$PROJECT_NUMBER \
  --display_name="Becoming Diamond - Production" 2>&1 || \
gcloud auth application-default set-quota-project $PROJECT_ID

# Note: gcloud doesn't have a direct command to create OAuth clients with redirect URIs
# We need to use the Google Cloud Console or REST API

echo ""
echo "============================================"
echo "OAuth Client Creation via Google Cloud Console"
echo "============================================"
echo ""
echo "Please complete the following steps manually in the Google Cloud Console:"
echo ""
echo "1. Go to: https://console.cloud.google.com/apis/credentials?project=becoming-diamond-master"
echo ""
echo "2. Click 'CREATE CREDENTIALS' → 'OAuth client ID'"
echo ""
echo "3. Create Production OAuth Client:"
echo "   - Application type: Web application"
echo "   - Name: Becoming Diamond - Production"
echo "   - Authorized JavaScript origins:"
echo "     • https://www.becomingdiamond.com"
echo "   - Authorized redirect URIs:"
echo "     • https://www.becomingdiamond.com/api/auth/callback/google"
echo ""
echo "4. Create Staging OAuth Client:"
echo "   - Application type: Web application"
echo "   - Name: Becoming Diamond - Staging"
echo "   - Authorized JavaScript origins:"
echo "     • https://staging.becomingdiamond.com"
echo "   - Authorized redirect URIs:"
echo "     • https://staging.becomingdiamond.com/api/auth/callback/google"
echo ""
echo "5. Create Development OAuth Client:"
echo "   - Application type: Web application"
echo "   - Name: Becoming Diamond - Development"
echo "   - Authorized JavaScript origins:"
echo "     • http://localhost:3003"
echo "   - Authorized redirect URIs:"
echo "     • http://localhost:3003/api/auth/callback/google"
echo ""
echo "6. Save each client ID and secret to update environment variables:"
echo ""
echo "   Production:"
echo "   AUTH_GOOGLE_ID_PROD=<production-client-id>"
echo "   AUTH_GOOGLE_SECRET_PROD=<production-client-secret>"
echo ""
echo "   Staging:"
echo "   AUTH_GOOGLE_ID_STAGING=<staging-client-id>"
echo "   AUTH_GOOGLE_SECRET_STAGING=<staging-client-secret>"
echo ""
echo "   Development:"
echo "   AUTH_GOOGLE_ID_DEV=<development-client-id>"
echo "   AUTH_GOOGLE_SECRET_DEV=<development-client-secret>"
echo ""
echo "============================================"
echo ""

# Open the console in browser
echo "Opening Google Cloud Console..."
open "https://console.cloud.google.com/apis/credentials?project=becoming-diamond-master"
