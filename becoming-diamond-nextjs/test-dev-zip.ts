#!/usr/bin/env bun

/**
 * Test script for /api/dev/zip endpoint
 * Tests all code paths including error cases
 * Run with: bun test-dev-zip.ts
 */

import { existsSync, copyFileSync, renameSync, unlinkSync } from "fs";

// ANSI color codes
const RED = '\x1b[0;31m';
const GREEN = '\x1b[0;32m';
const YELLOW = '\x1b[1;33m';
const BLUE = '\x1b[0;34m';
const NC = '\x1b[0m';

// Configuration
const BASE_URL = "http://localhost:3000";
const ENDPOINT = "/api/dev/zip";
const AUTH_PARAM = "whoistheboss=iamtheboss";

// Test counters
let testsPassed = 0;
let testsFailed = 0;

interface TestResult {
  name: string;
  expected: number;
  actual: number;
}

function printTestResult(testName: string, expectedStatus: number, actualStatus: number): void {
  if (expectedStatus === actualStatus) {
    console.log(`${GREEN}✓ PASS${NC}: ${testName} (status: ${actualStatus})`);
    testsPassed++;
  } else {
    console.log(`${RED}✗ FAIL${NC}: ${testName} (expected: ${expectedStatus}, got: ${actualStatus})`);
    testsFailed++;
  }
}

async function makeRequest(url: string): Promise<number> {
  try {
    const response = await fetch(url);
    return response.status;
  } catch (error) {
    return 0;
  }
}

async function makeRequestWithBody(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    return await response.text();
  } catch (error) {
    return "";
  }
}

function backupFile(filepath: string): boolean {
  if (existsSync(filepath)) {
    copyFileSync(filepath, `${filepath}.backup`);
    return true;
  }
  return false;
}

function restoreFile(filepath: string, hadBackup: boolean): void {
  if (hadBackup) {
    const backup = `${filepath}.backup`;
    if (existsSync(backup)) {
      renameSync(backup, filepath);
    }
  }
}

async function main(): Promise<number> {
  console.log(`${BLUE}========================================${NC}`);
  console.log(`${BLUE}Testing /api/dev/zip Endpoint${NC}`);
  console.log(`${BLUE}========================================${NC}\n`);

  // Check if dev server is running
  console.log(`${YELLOW}→${NC} Checking if dev server is running...`);
  try {
    await fetch(BASE_URL);
    console.log(`${GREEN}✓${NC} Dev server is running\n`);
  } catch (error) {
    console.log(`${RED}✗ ERROR${NC}: Dev server is not running at ${BASE_URL}`);
    console.log(`${YELLOW}→${NC} Please start the dev server with: npm run dev`);
    return 1;
  }

  // File paths
  const configFile = "repomix.config.json";
  const ignoreFile = ".repomixignore";
  const outputFile = "repomix-output.xml";

  // Backup original files
  console.log(`${YELLOW}→${NC} Backing up original files...`);
  const backupConfig = backupFile(configFile);
  const backupIgnore = backupFile(ignoreFile);
  const backupOutput = backupFile(outputFile);
  console.log(`${GREEN}✓${NC} Backup complete\n`);

  try {
    // Test 1: Missing authentication parameter
    console.log(`${YELLOW}Test 1:${NC} Missing authentication parameter`);
    let status = await makeRequest(`${BASE_URL}${ENDPOINT}`);
    printTestResult("Should return 401 without auth param", 401, status);
    console.log();

    // Test 2: Wrong authentication parameter
    console.log(`${YELLOW}Test 2:${NC} Wrong authentication parameter`);
    status = await makeRequest(`${BASE_URL}${ENDPOINT}?whoistheboss=wrongpassword`);
    printTestResult("Should return 401 with wrong auth param", 401, status);
    console.log();

    // Test 3: Missing repomix.config.json
    console.log(`${YELLOW}Test 3:${NC} Missing repomix.config.json`);
    if (existsSync(configFile)) {
      renameSync(configFile, `${configFile}.tmp`);
    }
    status = await makeRequest(`${BASE_URL}${ENDPOINT}?${AUTH_PARAM}`);
    printTestResult("Should return 400 without config file", 400, status);
    if (existsSync(`${configFile}.tmp`)) {
      renameSync(`${configFile}.tmp`, configFile);
    }
    console.log();

    // Test 4: Missing .repomixignore
    console.log(`${YELLOW}Test 4:${NC} Missing .repomixignore`);
    if (existsSync(ignoreFile)) {
      renameSync(ignoreFile, `${ignoreFile}.tmp`);
    }
    status = await makeRequest(`${BASE_URL}${ENDPOINT}?${AUTH_PARAM}`);
    printTestResult("Should return 400 without ignore file", 400, status);
    if (existsSync(`${ignoreFile}.tmp`)) {
      renameSync(`${ignoreFile}.tmp`, ignoreFile);
    }
    console.log();

    // Test 5: Successful execution
    console.log(`${YELLOW}Test 5:${NC} Successful execution with valid files`);
    if (!existsSync(configFile) || !existsSync(ignoreFile)) {
      console.log(`${RED}✗ SKIP${NC}: Required files missing, cannot test success path`);
    } else {
      // Delete old output if exists
      if (existsSync(outputFile)) {
        unlinkSync(outputFile);
      }

      status = await makeRequest(`${BASE_URL}${ENDPOINT}?${AUTH_PARAM}`);
      printTestResult("Should return 200 with valid config", 200, status);

      // Test 5b: Check if output file was created
      console.log(`${YELLOW}Test 5b:${NC} Verify repomix-output.xml was created`);
      if (existsSync(outputFile)) {
        console.log(`${GREEN}✓ PASS${NC}: repomix-output.xml was created`);
        testsPassed++;
      } else {
        console.log(`${RED}✗ FAIL${NC}: repomix-output.xml was not created`);
        testsFailed++;
      }

      // Test 5c: Verify Content-Type header
      console.log(`${YELLOW}Test 5c:${NC} Verify Content-Type header`);
      const response = await fetch(`${BASE_URL}${ENDPOINT}?${AUTH_PARAM}`);
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/xml")) {
        console.log(`${GREEN}✓ PASS${NC}: Content-Type is application/xml`);
        testsPassed++;
      } else {
        console.log(`${RED}✗ FAIL${NC}: Content-Type is '${contentType}' (expected application/xml)`);
        testsFailed++;
      }

      // Test 5d: Verify XML is valid
      console.log(`${YELLOW}Test 5d:${NC} Verify XML response is valid`);
      const responseText = await makeRequestWithBody(`${BASE_URL}${ENDPOINT}?${AUTH_PARAM}`);
      if (responseText.includes("<?xml") || responseText.includes("<file_summary>")) {
        console.log(`${GREEN}✓ PASS${NC}: Response contains valid XML`);
        testsPassed++;
      } else {
        console.log(`${RED}✗ FAIL${NC}: Response does not appear to be XML`);
        testsFailed++;
      }
    }
    console.log();

  } finally {
    // Restore original files
    console.log(`${YELLOW}→${NC} Restoring original files...`);
    restoreFile(configFile, backupConfig);
    restoreFile(ignoreFile, backupIgnore);
    restoreFile(outputFile, backupOutput);
    console.log(`${GREEN}✓${NC} Restore complete\n`);
  }

  // Summary
  console.log(`${BLUE}========================================${NC}`);
  console.log(`${BLUE}Test Summary${NC}`);
  console.log(`${BLUE}========================================${NC}`);
  console.log(`Total tests: ${testsPassed + testsFailed}`);
  console.log(`${GREEN}Passed: ${testsPassed}${NC}`);
  console.log(`${RED}Failed: ${testsFailed}${NC}`);

  if (testsFailed === 0) {
    console.log(`\n${GREEN}✓ All tests passed!${NC}`);
    return 0;
  } else {
    console.log(`\n${RED}✗ Some tests failed${NC}`);
    return 1;
  }
}

// Run the main function and exit with the result
main().then(code => process.exit(code));
