# Gmail SMTP Setup for Email Sending

Since your domain `becomingdiamond.com` is hosted on Wix (which doesn't support Resend DNS records), you can use **Google Workspace SMTP** to send emails from `support@becomingdiamond.com`.

---

## Prerequisites

✅ Google Workspace account with `support@becomingdiamond.com` email active

---

## Setup Steps

### Step 1: Generate App Password in Google Workspace

1. **Sign in to Google Account:**
   - Go to https://myaccount.google.com
   - Sign in as `support@becomingdiamond.com`

2. **Enable 2-Step Verification** (required for App Passwords):
   - Go to Security → 2-Step Verification
   - Follow prompts to enable if not already active

3. **Generate App Password:**
   - Go to Security → 2-Step Verification → App passwords
   - Or direct link: https://myaccount.google.com/apppasswords
   - Select "Mail" as app type
   - Select "Other (Custom name)" as device type
   - Name it: "Becoming Diamond Lead Emails"
   - Click **Generate**

4. **Copy the 16-character password:**
   ```
   Example: abcd efgh ijkl mnop
   ```
   - **Important:** Copy this immediately - you won't see it again!
   - Remove spaces when adding to `.env.local`: `abcdefghijklmnop`

### Step 2: Add to Environment Variables

Update `.env.local`:

```bash
GMAIL_USER=support@becomingdiamond.com
GMAIL_APP_PASSWORD=abcdefghijklmnop  # Replace with your 16-char password (no spaces)
```

### Step 3: Restart Development Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## How It Works

The lead capture system will automatically:
1. Detect `GMAIL_APP_PASSWORD` is set
2. Use Gmail SMTP instead of Resend
3. Send emails from `support@becomingdiamond.com` via Google's servers
4. Include Diamond Manifesto PDF attachment
5. Log all email activity

---

## Testing

1. **Submit a test lead:**
   - Go to http://localhost:3003
   - Fill in the lead form with your email
   - Check your inbox for welcome email

2. **Check server logs:**
   ```
   [EMAIL] Starting Gmail SMTP email send to your@email.com
   [EMAIL] Email template rendered
   [EMAIL] Gmail SMTP transporter initialized
   [EMAIL] Including Diamond Manifesto attachment
   [EMAIL] Calling Gmail SMTP
   [EMAIL] Gmail SMTP response received
   [EMAIL] Welcome email sent successfully to your@email.com
   ```

3. **Verify database:**
   ```bash
   npx tsx scripts/check-lead-emails.ts
   ```

   Should show:
   ```
   Email: your@email.com
     Status: sent
     Sent At: 2025-11-05T...
     Email ID: <message-id@gmail.com>
   ```

---

## Troubleshooting

### Error: "Invalid credentials"

**Cause:** App password is incorrect or not set

**Fix:**
1. Verify `GMAIL_APP_PASSWORD` in `.env.local` is exactly 16 characters (no spaces)
2. Regenerate app password if needed
3. Restart dev server

### Error: "Username and Password not accepted"

**Cause:** 2-Step Verification not enabled

**Fix:**
1. Enable 2-Step Verification in Google Account
2. Wait 5 minutes for Google to propagate settings
3. Generate new app password

### Error: "SMTP connection failed"

**Cause:** Network/firewall blocking SMTP port 587

**Fix:**
1. Check if port 587 is open
2. Try using a different network
3. Check corporate firewall settings

### Emails send but go to spam

**Cause:** Google Workspace domain not fully verified or SPF/DKIM not configured

**Fix:**
1. Verify domain in Google Workspace Admin Console
2. Add SPF record to DNS (should already be set by Wix/Google)
3. Add DKIM signing in Google Workspace
4. Send test emails to yourself first to warm up sender reputation

---

## Production Deployment

### Add to Vercel Environment Variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   ```
   GMAIL_USER=support@becomingdiamond.com
   GMAIL_APP_PASSWORD=your-16-char-password
   ```
3. Redeploy application

**Security Notes:**
- ✅ App passwords are safer than account password
- ✅ Can be revoked anytime from Google Account
- ✅ Scoped only to mail access
- ⚠️ Never commit to Git (already in `.gitignore`)
- ⚠️ Rotate password quarterly

---

## Advantages vs Resend

### Google Workspace SMTP ✅
- ✅ Works with Wix-hosted domains
- ✅ No DNS configuration needed
- ✅ Uses existing email infrastructure
- ✅ Trusted sender (Google's reputation)
- ✅ Free (included with Google Workspace)
- ⚠️ Daily limit: 2,000 emails/day (enough for most needs)
- ⚠️ Manual app password management

### Resend ⚠️
- ✅ Better API and developer experience
- ✅ Higher sending limits
- ⚠️ Requires DNS configuration (not possible with Wix)
- ⚠️ Additional monthly cost

---

## Fallback Behavior

The system automatically falls back to Resend if Gmail is not configured:

```typescript
// Uses Gmail SMTP if password is set, otherwise Resend
import { sendWelcomeEmail } from process.env.GMAIL_APP_PASSWORD
  ? "@/lib/gmail-smtp"
  : "@/lib/resend";
```

This allows:
- **Local development:** Use Gmail SMTP
- **Testing:** Switch to Resend shared domain if needed
- **Production:** Use Gmail SMTP with real Google Workspace

---

## Next Steps

After email sending works:
1. ✅ Test email deliverability to Gmail, Outlook, Apple Mail
2. ✅ Verify Diamond Manifesto PDF attachment works
3. ✅ Check spam score (use https://www.mail-tester.com)
4. ✅ Monitor email open rates in Google Workspace Admin
5. ⏳ Set up email sequences (future enhancement)

---

**Questions?**
- Check `/docs/specs/integrations/resend-lead-email-integration.prd.md` for full email system documentation
- Review server logs for detailed email sending diagnostics
