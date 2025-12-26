/**
 * Email Stability Monitor
 *
 * Monitors Gmail SMTP DNS resolution and connection stability over 48 hours.
 * Runs periodic checks and logs results for analysis.
 *
 * Usage:
 *   npm run monitor:email        # Run with default settings (5 min intervals)
 *   npm run monitor:email:fast   # Run with 1 min intervals (for testing)
 *
 * Safety Features:
 * - Does NOT spam production with fake leads
 * - Only tests DNS + SMTP connection (no actual emails sent)
 * - Automatically stops after 48 hours
 * - Logs to file for analysis
 */

import nodemailer from "nodemailer";
import { config } from "dotenv";
import path from "path";
import fs from "fs";
import dns from "dns/promises";

config({ path: path.join(process.cwd(), ".env.local") });

// Configuration
const MONITORING_DURATION = 48 * 60 * 60 * 1000; // 48 hours in ms
const CHECK_INTERVAL = parseInt(process.env.MONITOR_INTERVAL || "300000"); // Default: 5 minutes
const LOG_FILE = path.join(process.cwd(), "logs", "email-stability.log");
const STATS_FILE = path.join(process.cwd(), "logs", "email-stability-stats.json");

interface CheckResult {
  timestamp: string;
  checkNumber: number;
  dnsResolution: {
    success: boolean;
    ip?: string;
    duration: number;
    error?: string;
  };
  smtpConnection: {
    success: boolean;
    duration: number;
    error?: string;
  };
}

interface MonitoringStats {
  startTime: string;
  endTime?: string;
  totalChecks: number;
  dnsSuccesses: number;
  dnsFailures: number;
  smtpSuccesses: number;
  smtpFailures: number;
  averageDnsTime: number;
  averageSmtpTime: number;
  uniqueIPs: string[];
}

const stats: MonitoringStats = {
  startTime: new Date().toISOString(),
  totalChecks: 0,
  dnsSuccesses: 0,
  dnsFailures: 0,
  smtpSuccesses: 0,
  smtpFailures: 0,
  averageDnsTime: 0,
  averageSmtpTime: 0,
  uniqueIPs: [],
};

/**
 * Ensure log directory exists
 */
function ensureLogDirectory() {
  const logDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

/**
 * Log message to console and file
 */
function log(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(LOG_FILE, logMessage + "\n");
}

/**
 * Test DNS resolution for smtp.gmail.com
 */
async function testDnsResolution(): Promise<CheckResult["dnsResolution"]> {
  const startTime = Date.now();
  try {
    const addresses = await dns.resolve4("smtp.gmail.com");
    const duration = Date.now() - startTime;
    const ip = addresses[0]; // Use first IP

    // Track unique IPs
    if (!stats.uniqueIPs.includes(ip)) {
      stats.uniqueIPs.push(ip);
    }

    return {
      success: true,
      ip,
      duration,
    };
  } catch (error) {
    return {
      success: false,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Test SMTP connection (verify only, no email sent)
 */
async function testSmtpConnection(): Promise<CheckResult["smtpConnection"]> {
  const startTime = Date.now();

  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return {
      success: false,
      duration: 0,
      error: "Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables",
    };
  }

  try {
    const cleanPassword = GMAIL_APP_PASSWORD.replace(/[\s"']/g, "");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: GMAIL_USER,
        pass: cleanPassword,
      },
      tls: {
        servername: "smtp.gmail.com",
        rejectUnauthorized: true,
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 120000,
    });

    // Verify connection (doesn't send email)
    await transporter.verify();
    const duration = Date.now() - startTime;

    return {
      success: true,
      duration,
    };
  } catch (error: any) {
    return {
      success: false,
      duration: Date.now() - startTime,
      error: `${error.code || "ERROR"}: ${error.message}`,
    };
  }
}

/**
 * Perform a single check
 */
async function performCheck(checkNumber: number): Promise<CheckResult> {
  const timestamp = new Date().toISOString();

  log(`\n=== Check #${checkNumber} ===`);

  // Test DNS resolution
  log("Testing DNS resolution...");
  const dnsResult = await testDnsResolution();
  if (dnsResult.success) {
    log(`✅ DNS resolved to ${dnsResult.ip} in ${dnsResult.duration}ms`);
    stats.dnsSuccesses++;
  } else {
    log(`❌ DNS resolution failed: ${dnsResult.error} (${dnsResult.duration}ms)`);
    stats.dnsFailures++;
  }

  // Test SMTP connection
  log("Testing SMTP connection...");
  const smtpResult = await testSmtpConnection();
  if (smtpResult.success) {
    log(`✅ SMTP connection successful in ${smtpResult.duration}ms`);
    stats.smtpSuccesses++;
  } else {
    log(`❌ SMTP connection failed: ${smtpResult.error} (${smtpResult.duration}ms)`);
    stats.smtpFailures++;
  }

  // Update stats
  stats.totalChecks++;
  stats.averageDnsTime =
    (stats.averageDnsTime * (stats.totalChecks - 1) + dnsResult.duration) / stats.totalChecks;
  stats.averageSmtpTime =
    (stats.averageSmtpTime * (stats.totalChecks - 1) + smtpResult.duration) / stats.totalChecks;

  const result: CheckResult = {
    timestamp,
    checkNumber,
    dnsResolution: dnsResult,
    smtpConnection: smtpResult,
  };

  return result;
}

/**
 * Display current statistics
 */
function displayStats() {
  const dnsSuccessRate = stats.totalChecks > 0
    ? ((stats.dnsSuccesses / stats.totalChecks) * 100).toFixed(2)
    : "0.00";
  const smtpSuccessRate = stats.totalChecks > 0
    ? ((stats.smtpSuccesses / stats.totalChecks) * 100).toFixed(2)
    : "0.00";

  log(`\n📊 Current Statistics:`);
  log(`   Total Checks: ${stats.totalChecks}`);
  log(`   DNS Success Rate: ${dnsSuccessRate}% (${stats.dnsSuccesses}/${stats.totalChecks})`);
  log(`   SMTP Success Rate: ${smtpSuccessRate}% (${stats.smtpSuccesses}/${stats.totalChecks})`);
  log(`   Average DNS Time: ${stats.averageDnsTime.toFixed(0)}ms`);
  log(`   Average SMTP Time: ${stats.averageSmtpTime.toFixed(0)}ms`);
  log(`   Unique IPs Seen: ${stats.uniqueIPs.length} (${stats.uniqueIPs.join(", ")})`);
}

/**
 * Save statistics to file
 */
function saveStats() {
  stats.endTime = new Date().toISOString();
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
  log(`\n💾 Statistics saved to ${STATS_FILE}`);
}

/**
 * Main monitoring loop
 */
async function startMonitoring() {
  ensureLogDirectory();

  const startTime = Date.now();
  const endTime = startTime + MONITORING_DURATION;
  const totalChecks = Math.floor(MONITORING_DURATION / CHECK_INTERVAL);

  log("=".repeat(80));
  log("🔍 EMAIL STABILITY MONITOR");
  log("=".repeat(80));
  log(`Start Time: ${new Date(startTime).toISOString()}`);
  log(`End Time: ${new Date(endTime).toISOString()}`);
  log(`Duration: 48 hours`);
  log(`Check Interval: ${CHECK_INTERVAL / 1000} seconds`);
  log(`Estimated Checks: ${totalChecks}`);
  log(`Log File: ${LOG_FILE}`);
  log(`Stats File: ${STATS_FILE}`);
  log("=".repeat(80));

  let checkNumber = 0;
  let intervalId: NodeJS.Timeout;

  const performScheduledCheck = async () => {
    checkNumber++;

    try {
      await performCheck(checkNumber);
      displayStats();
      saveStats();

      // Check if we should stop
      const now = Date.now();
      const timeRemaining = endTime - now;

      if (timeRemaining <= 0) {
        log("\n⏱️  48-hour monitoring period completed!");
        displayFinalReport();
        clearInterval(intervalId);
        process.exit(0);
      } else {
        const hoursRemaining = (timeRemaining / (60 * 60 * 1000)).toFixed(1);
        log(`\n⏳ Time remaining: ${hoursRemaining} hours`);
        log(`   Next check in ${CHECK_INTERVAL / 1000} seconds...`);
      }
    } catch (error) {
      log(`\n❌ Error during check: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Perform first check immediately
  await performScheduledCheck();

  // Schedule subsequent checks
  intervalId = setInterval(performScheduledCheck, CHECK_INTERVAL);

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    log("\n\n⚠️  Monitor stopped by user (Ctrl+C)");
    displayFinalReport();
    clearInterval(intervalId);
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    log("\n\n⚠️  Monitor stopped by system");
    displayFinalReport();
    clearInterval(intervalId);
    process.exit(0);
  });
}

/**
 * Display final report
 */
function displayFinalReport() {
  log("\n");
  log("=".repeat(80));
  log("📋 FINAL REPORT");
  log("=".repeat(80));

  const duration = stats.endTime
    ? new Date(stats.endTime).getTime() - new Date(stats.startTime).getTime()
    : Date.now() - new Date(stats.startTime).getTime();

  const durationHours = (duration / (60 * 60 * 1000)).toFixed(2);
  const dnsSuccessRate = stats.totalChecks > 0
    ? ((stats.dnsSuccesses / stats.totalChecks) * 100).toFixed(2)
    : "0.00";
  const smtpSuccessRate = stats.totalChecks > 0
    ? ((stats.smtpSuccesses / stats.totalChecks) * 100).toFixed(2)
    : "0.00";

  log(`Monitoring Duration: ${durationHours} hours`);
  log(`Total Checks: ${stats.totalChecks}`);
  log(`\nDNS Resolution:`);
  log(`  Success Rate: ${dnsSuccessRate}% (${stats.dnsSuccesses}/${stats.totalChecks})`);
  log(`  Failures: ${stats.dnsFailures}`);
  log(`  Average Time: ${stats.averageDnsTime.toFixed(0)}ms`);
  log(`  Unique IPs: ${stats.uniqueIPs.length}`);
  log(`  IP List: ${stats.uniqueIPs.join(", ")}`);
  log(`\nSMTP Connection:`);
  log(`  Success Rate: ${smtpSuccessRate}% (${stats.smtpSuccesses}/${stats.totalChecks})`);
  log(`  Failures: ${stats.smtpFailures}`);
  log(`  Average Time: ${stats.averageSmtpTime.toFixed(0)}ms`);

  log(`\n📊 Recommendation:`);
  if (parseFloat(dnsSuccessRate) >= 99.5 && parseFloat(smtpSuccessRate) >= 99.5) {
    log(`  ✅ EXCELLENT: DNS and SMTP are highly stable`);
    log(`  ✅ Safe to deploy to production`);
  } else if (parseFloat(dnsSuccessRate) >= 95 && parseFloat(smtpSuccessRate) >= 95) {
    log(`  ⚠️  ACCEPTABLE: Some intermittent issues detected`);
    log(`  ⚠️  Monitor production closely after deployment`);
  } else {
    log(`  ❌ POOR: Significant stability issues detected`);
    log(`  ❌ Investigate network/DNS configuration before production deployment`);
  }

  log("=".repeat(80));
  log(`\nFull logs: ${LOG_FILE}`);
  log(`Statistics: ${STATS_FILE}`);

  saveStats();
}

// Start monitoring
startMonitoring().catch((error) => {
  log(`\n❌ Fatal error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
