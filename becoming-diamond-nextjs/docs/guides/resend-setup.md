# Resend Email Integration Setup Guide

This guide walks through setting up Resend email service for the lead generation system.

## Prerequisites

- Resend account (free tier: 3,000 emails/month)
- Verified sending domain
- Access to DNS settings for your domain

---

## Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email address
3. Navigate to the dashboard

---

## Step 2: Verify Your Sending Domain

### Why Domain Verification?

Domain verification ensures your emails are delivered and not marked as spam. It configures SPF, DKIM, and DMARC records.

### Steps:

1. In Resend dashboard, go to **Domains** → **Add Domain**
2. Enter your domain: `becomingdiamond.com`
3. Resend will provide DNS records to add
4. Add these DNS records to your domain provider:

**Example DNS Records:**

```
Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all
TTL: 3600

Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.resend.com
TTL: 3600

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:admin@becomingdiamond.com
TTL: 3600
```

5. Wait 5-10 minutes for DNS propagation
6. Click **Verify Domain** in Resend dashboard
7. Once verified, you'll see a green checkmark

---

## Step 3: Generate API Key

1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Name: `Production - Becoming Diamond`
4. Permissions: **Full Access** (or **Sending Access** if you only need to send emails)
5. Copy the API key (you won't see it again!)

**Format:** `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Step 4: Configure Environment Variables

Add these variables to your `.env.local` file:

```bash
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=hello@becomingdiamond.com
RESEND_ADMIN_EMAIL=admin@becomingdiamond.com  # Optional: for new lead notifications
NEXT_PUBLIC_BASE_URL=https://becomingdiamond.com  # Production URL
```

### Environment Variable Descriptions:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `RESEND_API_KEY` | **Yes** | API key from Resend dashboard | `re_abc123...` |
| `RESEND_FROM_EMAIL` | **Yes** | Verified sender email address | `hello@becomingdiamond.com` |
| `RESEND_ADMIN_EMAIL` | No | Email for admin notifications on new leads | `admin@becomingdiamond.com` |
| `NEXT_PUBLIC_BASE_URL` | **Yes** | Base URL for links in emails (must be publicly accessible) | `https://becomingdiamond.com` |

### For Local Development:

```bash
RESEND_API_KEY=re_your_test_api_key
RESEND_FROM_EMAIL=hello@becomingdiamond.com
NEXT_PUBLIC_BASE_URL=http://localhost:3003
```

**Note:** Resend allows sending test emails to verified email addresses even if your domain is not verified yet.

---

## Step 5: Add Environment Variables to Vercel

If deploying to Vercel:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add each variable:
   - Key: `RESEND_API_KEY`
   - Value: `re_your_api_key_here`
   - Environments: **Production**, **Preview**, **Development**
3. Repeat for `RESEND_FROM_EMAIL`, `RESEND_ADMIN_EMAIL`, `NEXT_PUBLIC_BASE_URL`
4. Redeploy your application for changes to take effect

---

## Step 6: Run Database Migration

The email integration requires new database columns for tracking email delivery.

```bash
npm run db:migrate
```

This will run the migration `003_add_email_tracking_to_leads.sql` which adds:
- `email_sent_at` - Timestamp when email was sent
- `email_status` - Status: `pending`, `sent`, `failed`, `bounced`
- `email_id` - Resend email ID for tracking
- `unsubscribe_token` - Unique token for unsubscribe links

---

## Step 7: Test Email Delivery

### Test in Development:

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3003 in your browser

3. Scroll to the lead capture form

4. Enter your email address and submit

5. Check your inbox for the welcome email

### Verify in Resend Dashboard:

1. Go to **Resend Dashboard** → **Emails**
2. You should see the sent email with status `delivered`
3. Click on the email to see details (opens, clicks, etc.)

### Test Unsubscribe:

1. Open the welcome email
2. Click the **Unsubscribe** link at the bottom
3. You should see a success page
4. Verify in the database that `subscribed = 0` for that lead

---

## Step 8: Monitor Email Deliverability

### Check Sender Reputation:

Use these tools to monitor your email sending reputation:

1. **Resend Dashboard**: View delivery rates, bounces, complaints
2. **Google Postmaster Tools**: Track Gmail deliverability
   - Add your domain at https://postmaster.google.com
3. **Mail Tester**: Test email spam score
   - Send test email to address provided at https://www.mail-tester.com

### Recommended Thresholds:

| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| Delivery Rate | >98% | 95-98% | <95% |
| Bounce Rate | <2% | 2-5% | >5% |
| Spam Complaint Rate | <0.1% | 0.1-0.5% | >0.5% |
| Unsubscribe Rate | <0.5% | 0.5-2% | >2% |

---

## Troubleshooting

### Emails Not Sending

**Symptom:** Form submits successfully but no email is received.

**Solutions:**

1. Check environment variables are set correctly:
   ```bash
   echo $RESEND_API_KEY
   ```

2. Check application logs for errors:
   ```bash
   npm run dev
   # Submit form and watch console
   ```

3. Verify Resend API key is valid:
   - Go to Resend Dashboard → API Keys
   - Check if the key is active

4. Check database for email status:
   ```sql
   SELECT email, email_status, email_sent_at FROM leads ORDER BY created_at DESC LIMIT 10;
   ```

### Emails Going to Spam

**Symptom:** Emails are delivered but land in spam folder.

**Solutions:**

1. Verify domain is properly configured (SPF, DKIM, DMARC)
2. Check sender reputation in Resend dashboard
3. Avoid spam trigger words in subject/content
4. Maintain high engagement (opens, clicks)
5. Warm up your sending domain gradually (start with low volume)

### Unsubscribe Link Not Working

**Symptom:** Clicking unsubscribe returns an error.

**Solutions:**

1. Check `NEXT_PUBLIC_BASE_URL` is set correctly
2. Verify database has `unsubscribe_token` column
3. Check application logs for errors
4. Test the unsubscribe URL format:
   ```
   https://becomingdiamond.com/api/unsubscribe?token=abc123...
   ```

### Database Migration Errors

**Symptom:** `npm run db:migrate` fails with error.

**Solutions:**

1. Check database connection:
   ```bash
   echo $DATABASE_URL
   echo $DATABASE_AUTH_TOKEN
   ```

2. Verify Turso database is accessible:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" $DATABASE_URL
   ```

3. If columns already exist, migration will fail. Manual fix:
   ```sql
   -- Check if columns exist
   PRAGMA table_info(leads);

   -- If migration failed midway, manually add missing columns
   ALTER TABLE leads ADD COLUMN email_sent_at TEXT;
   ALTER TABLE leads ADD COLUMN email_status TEXT DEFAULT 'pending';
   ALTER TABLE leads ADD COLUMN email_id TEXT;
   ALTER TABLE leads ADD COLUMN unsubscribe_token TEXT UNIQUE;
   ```

---

## Email Templates

The welcome email template is located at:

```
src/emails/welcome-email.tsx
```

To modify the email content:

1. Edit the template file
2. Restart the dev server to see changes
3. Test by submitting the lead form

### Email Preview (Development):

You can preview emails locally using React Email's preview tool:

```bash
npx react-email dev
```

This opens a browser at http://localhost:3000 showing all email templates.

---

## Production Checklist

Before deploying to production:

- [ ] Domain verified in Resend (SPF, DKIM, DMARC records added)
- [ ] API key generated and added to Vercel environment variables
- [ ] `RESEND_FROM_EMAIL` uses verified domain
- [ ] `NEXT_PUBLIC_BASE_URL` points to production URL
- [ ] Database migration applied to production database
- [ ] Test email sent and received successfully
- [ ] Unsubscribe link tested and working
- [ ] Email deliverability monitored (first 24 hours)
- [ ] Spam score checked (use Mail Tester)
- [ ] Admin notifications tested (if enabled)

---

## Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [React Email Documentation](https://react.email)
- [Email Deliverability Best Practices](https://resend.com/docs/dashboard/emails/deliverability)
- [SPF, DKIM, DMARC Explained](https://resend.com/docs/dashboard/domains/spf-dkim-dmarc)

---

## Support

For issues with Resend integration:

1. Check Resend Status Page: https://status.resend.com
2. Resend Support: support@resend.com
3. Resend Discord: https://discord.gg/resend

For code-related issues:

1. Check application logs
2. Review PRD: `docs/specs/integrations/resend-lead-email-integration.prd.md`
3. Search codebase for email-related errors
