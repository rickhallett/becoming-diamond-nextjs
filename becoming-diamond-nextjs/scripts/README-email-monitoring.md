# Email Monitoring Scripts

## Overview

These scripts help test and monitor the Gmail SMTP email infrastructure used for magic link authentication and welcome emails.

## Scripts Available

### 1. Test Gmail SMTP (`test:gmail`)

Quick test to verify Gmail SMTP connectivity and send a test email.

```bash
npm run test:gmail
```

**What it does:**
- Tests DNS resolution for smtp.gmail.com
- Verifies SMTP connection with authentication
- Sends a test email to yourself
- Displays detailed connection logs

**Duration:** ~10-30 seconds

**Use when:**
- Setting up Gmail SMTP for the first time
- Verifying credentials are correct
- Quick connectivity check
- Debugging email delivery issues

### 2. Email Stability Monitor (`monitor:email`)

48-hour monitoring script to validate DNS and SMTP stability.

```bash
npm run monitor:email        # Default: 5-minute intervals
npm run monitor:email:fast   # Fast mode: 1-minute intervals
```

**What it does:**
- Runs periodic checks for 48 hours
- Tests DNS resolution (smtp.gmail.com → IP address)
- Tests SMTP connection (verify only, NO emails sent)
- Tracks statistics:
  - Success/failure rates
  - Average response times
  - Unique IPs seen (validates load balancing)
- Generates logs and final report

**Output Files:**
- `logs/email-stability.log` - Detailed timestamped logs
- `logs/email-stability-stats.json` - Statistics in JSON format

**Duration:** 48 hours (or until Ctrl+C)

**Use when:**
- After fixing DNS/SMTP configuration
- Before deploying to production
- Validating long-term stability
- Investigating intermittent email issues

## Interpreting Results

### Test Gmail SMTP

**Success:**
```
✅ SMTP connection successful!
✅ Email sent successfully!
✅ Gmail SMTP is working correctly!
```

**Failure:**
```
❌ SMTP Error:
Code: EAUTH
```
Check troubleshooting section in output.

### Email Stability Monitor

**Final Report Recommendations:**

- **≥99.5% success rate** - ✅ EXCELLENT
  - DNS and SMTP highly stable
  - Safe to deploy to production

- **95-99.5% success rate** - ⚠️ ACCEPTABLE
  - Some intermittent issues detected
  - Monitor production closely after deployment

- **<95% success rate** - ❌ POOR
  - Significant stability issues
  - Investigate network/DNS configuration before deployment

## Common Issues

### Authentication Failed (EAUTH)
1. Verify 2-Step Verification is enabled on Google account
2. Generate a new App Password at https://myaccount.google.com/apppasswords
3. Check App Password is correct (16 characters, no spaces)
4. Ensure `.env.local` has correct credentials:
   ```
   GMAIL_USER=support@becomingdiamond.com
   GMAIL_APP_PASSWORD=your-16-char-password
   ```

### Connection Timeout (ETIMEDOUT)
1. Check internet connection
2. Verify port 465 (SSL) is not blocked by firewall
3. Try different network
4. Test DNS: `nslookup smtp.gmail.com`

### Intermittent Failures
- Run `monitor:email` for 48 hours to identify patterns
- Check if failures correlate with specific times/IPs
- Consider network quality issues

## Technical Details

### Gmail SMTP Configuration

```typescript
{
  host: "smtp.gmail.com",        // Hostname (not IP!)
  port: 465,                     // SSL port
  secure: true,                  // Use SSL
  connectionTimeout: 60000,      // 60s
  greetingTimeout: 30000,        // 30s
  socketTimeout: 120000,         // 120s
}
```

**Why hostname not IP?**
- Google uses load balancing across multiple IPs
- IPs can change without notice
- Hostname ensures proper SSL certificate validation
- Better reliability and geographic routing

### Monitoring Safety Features

- **No spam**: Only connection verification, no actual emails sent
- **Automatic stop**: Terminates after 48 hours
- **Graceful shutdown**: Ctrl+C saves stats before exit
- **Resource efficient**: Minimal CPU/memory usage

## Environment Variables

Required in `.env.local`:

```bash
GMAIL_USER=support@becomingdiamond.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

Optional for monitoring:

```bash
MONITOR_INTERVAL=300000  # Check interval in milliseconds (default: 5 min)
```

## Related Files

- `scripts/test-gmail-smtp.ts` - SMTP test script
- `scripts/monitor-email-stability.ts` - Monitoring script
- `src/lib/gmail-smtp.ts` - Production SMTP configuration
- `auth.ts` - NextAuth with Nodemailer provider
- `docs/specs/email-provider-migration-analysis.md` - Email infrastructure analysis
