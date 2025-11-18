import nodemailer from "nodemailer";
import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), ".env.local") });

async function testGmailSMTP() {
  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

  console.log("\n=== Gmail SMTP Test ===\n");
  console.log(`User: ${GMAIL_USER}`);
  console.log(`Password: ${GMAIL_APP_PASSWORD ? `${GMAIL_APP_PASSWORD.substring(0, 4)}...${GMAIL_APP_PASSWORD.substring(GMAIL_APP_PASSWORD.length - 4)} (${GMAIL_APP_PASSWORD.length} chars)` : "NOT SET"}`);

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error("\n❌ Missing credentials");
    console.log("\nSet in .env.local:");
    console.log("GMAIL_USER=your-email@gmail.com");
    console.log("GMAIL_APP_PASSWORD=your-16-char-password");
    return;
  }

  // Clean password
  const cleanPassword = GMAIL_APP_PASSWORD.replace(/[\s"']/g, "");
  console.log(`Cleaned password length: ${cleanPassword.length} chars`);

  // Create transporter matching production config (port 465 SSL)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL
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
    debug: true,
    logger: true,
  });

  console.log("\n📧 Testing SMTP connection...\n");

  try {
    // Verify connection
    await transporter.verify();
    console.log("\n✅ SMTP connection successful!\n");

    // Try sending a test email
    console.log("📤 Sending test email...\n");
    const result = await transporter.sendMail({
      from: GMAIL_USER,
      to: GMAIL_USER, // Send to self
      subject: "Gmail SMTP Test",
      text: "This is a test email from Becoming Diamond Gmail SMTP integration.",
      html: "<p>This is a test email from Becoming Diamond Gmail SMTP integration.</p>",
    });

    console.log("\n✅ Email sent successfully!");
    console.log(`Message ID: ${result.messageId}`);
    console.log(`Response: ${result.response}`);
    console.log("\n✅ Gmail SMTP is working correctly!\n");
  } catch (error: any) {
    console.error("\n❌ SMTP Error:\n");
    console.error(`Code: ${error.code}`);
    console.error(`Response Code: ${error.responseCode}`);
    console.error(`Command: ${error.command}`);
    console.error(`Message: ${error.message}`);
    console.error(`Response: ${error.response}`);

    console.log("\n🔧 Troubleshooting:\n");

    if (error.code === "EAUTH") {
      console.log("Authentication failed. Check:");
      console.log("  1. Is 2-Step Verification enabled on this Google account?");
      console.log("     → Go to: https://myaccount.google.com/security");
      console.log("  2. Did you create an App Password?");
      console.log("     → Go to: https://myaccount.google.com/apppasswords");
      console.log("  3. Is the App Password correct (16 characters, no spaces)?");
      console.log("  4. Try generating a new App Password");
      console.log("  5. If using Google Workspace, check admin hasn't disabled App Passwords");
    } else if (error.code === "ETIMEDOUT" || error.code === "ECONNECTION") {
      console.log("Connection failed. Check:");
      console.log("  1. Is your internet connection working?");
      console.log("  2. Is port 465 (SSL) blocked by firewall?");
      console.log("  3. Try a different network");
      console.log("  4. DNS resolution working? Try: nslookup smtp.gmail.com");
    } else {
      console.log("Unknown error. Check Gmail SMTP settings and try again.");
    }

    console.log("\n");
    process.exit(1);
  }
}

testGmailSMTP().catch(console.error);
