#!/bin/bash

# Test script for /api/dev/zip endpoint
# Tests all code paths including error cases

# set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:3000"
ENDPOINT="/api/dev/zip"
AUTH_PARAM="whoistheboss=iamtheboss"

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to print test results
print_test_result() {
  local test_name="$1"
  local expected_status="$2"
  local actual_status="$3"

  if [ "$expected_status" -eq "$actual_status" ]; then
    echo -e "${GREEN}✓ PASS${NC}: $test_name (status: $actual_status)"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}: $test_name (expected: $expected_status, got: $actual_status)"
    ((TESTS_FAILED++))
  fi
}

# Helper function to make HTTP request and return status code
make_request() {
  local url="$1"
  curl -s -o /dev/null -w "%{http_code}" "$url"
}

# Helper function to make HTTP request and return body
make_request_with_body() {
  local url="$1"
  curl -s "$url"
}

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing /api/dev/zip Endpoint${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if dev server is running
echo -e "${YELLOW}→${NC} Checking if dev server is running..."
if ! curl -s -f "$BASE_URL" > /dev/null; then
  echo -e "${RED}✗ ERROR${NC}: Dev server is not running at $BASE_URL"
  echo -e "${YELLOW}→${NC} Please start the dev server with: npm run dev"
  exit 1
fi
echo -e "${GREEN}✓${NC} Dev server is running\n"

# Backup original files (if they exist)
echo -e "${YELLOW}→${NC} Backing up original files..."
if [ -f "repomix.config.json" ]; then
  cp repomix.config.json repomix.config.json.backup
  BACKUP_CONFIG=1
fi
if [ -f ".repomixignore" ]; then
  cp .repomixignore .repomixignore.backup
  BACKUP_IGNORE=1
fi
if [ -f "repomix-output.xml" ]; then
  cp repomix-output.xml repomix-output.xml.backup
  BACKUP_OUTPUT=1
fi
echo -e "${GREEN}✓${NC} Backup complete\n"

# Test 1: Missing authentication parameter
echo -e "${YELLOW}Test 1:${NC} Missing authentication parameter"
status=$(make_request "$BASE_URL$ENDPOINT")
print_test_result "Should return 401 without auth param" 401 "$status"
echo ""

# Test 2: Wrong authentication parameter
echo -e "${YELLOW}Test 2:${NC} Wrong authentication parameter"
status=$(make_request "$BASE_URL$ENDPOINT?whoistheboss=wrongpassword")
print_test_result "Should return 401 with wrong auth param" 401 "$status"
echo ""

# Test 3: Missing repomix.config.json
echo -e "${YELLOW}Test 3:${NC} Missing repomix.config.json"
if [ -f "repomix.config.json" ]; then
  mv repomix.config.json repomix.config.json.tmp
fi
status=$(make_request "$BASE_URL$ENDPOINT?$AUTH_PARAM")
print_test_result "Should return 400 without config file" 400 "$status"
if [ -f "repomix.config.json.tmp" ]; then
  mv repomix.config.json.tmp repomix.config.json
fi
echo ""

# Test 4: Missing .repomixignore
echo -e "${YELLOW}Test 4:${NC} Missing .repomixignore"
if [ -f ".repomixignore" ]; then
  mv .repomixignore .repomixignore.tmp
fi
status=$(make_request "$BASE_URL$ENDPOINT?$AUTH_PARAM")
print_test_result "Should return 400 without ignore file" 400 "$status"
if [ -f ".repomixignore.tmp" ]; then
  mv .repomixignore.tmp .repomixignore
fi
echo ""

# Test 5: Successful execution (both files present)
echo -e "${YELLOW}Test 5:${NC} Successful execution with valid files"
if [ ! -f "repomix.config.json" ] || [ ! -f ".repomixignore" ]; then
  echo -e "${RED}✗ SKIP${NC}: Required files missing, cannot test success path"
else
  # Delete old output if exists
  if [ -f "repomix-output.xml" ]; then
    rm repomix-output.xml
  fi

  status=$(make_request "$BASE_URL$ENDPOINT?$AUTH_PARAM")
  print_test_result "Should return 200 with valid config" 200 "$status"

  # Test 5b: Check if output file was created
  echo -e "${YELLOW}Test 5b:${NC} Verify repomix-output.xml was created"
  if [ -f "repomix-output.xml" ]; then
    echo -e "${GREEN}✓ PASS${NC}: repomix-output.xml was created"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}: repomix-output.xml was not created"
    ((TESTS_FAILED++))
  fi

  # Test 5c: Verify XML content type
  echo -e "${YELLOW}Test 5c:${NC} Verify Content-Type header"
  content_type=$(curl -s -I "$BASE_URL$ENDPOINT?$AUTH_PARAM" | grep -i "content-type" | cut -d' ' -f2- | tr -d '\r')
  if [[ "$content_type" == *"application/xml"* ]]; then
    echo -e "${GREEN}✓ PASS${NC}: Content-Type is application/xml"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}: Content-Type is '$content_type' (expected application/xml)"
    ((TESTS_FAILED++))
  fi

  # Test 5d: Verify XML is valid
  echo -e "${YELLOW}Test 5d:${NC} Verify XML response is valid"
  response=$(make_request_with_body "$BASE_URL$ENDPOINT?$AUTH_PARAM")
  if [[ "$response" == *"<?xml"* ]] || [[ "$response" == *"<file_summary>"* ]]; then
    echo -e "${GREEN}✓ PASS${NC}: Response contains valid XML"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}: Response does not appear to be XML"
    ((TESTS_FAILED++))
  fi
fi
echo ""

# Restore original files
echo -e "${YELLOW}→${NC} Restoring original files..."
if [ "$BACKUP_CONFIG" = "1" ]; then
  mv repomix.config.json.backup repomix.config.json
fi
if [ "$BACKUP_IGNORE" = "1" ]; then
  mv .repomixignore.backup .repomixignore
fi
if [ "$BACKUP_OUTPUT" = "1" ]; then
  mv repomix-output.xml.backup repomix-output.xml
fi
echo -e "${GREEN}✓${NC} Restore complete\n"

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Total tests: $((TESTS_PASSED + TESTS_FAILED))"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "\n${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "\n${RED}✗ Some tests failed${NC}"
  exit 1
fi
