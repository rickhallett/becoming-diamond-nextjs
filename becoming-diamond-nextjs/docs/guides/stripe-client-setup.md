# Stripe Account Setup Guide for Clients

This guide will walk you through setting up your Stripe account to accept payments for your book "Turning Snowflakes into Diamonds" ($14.99). You'll provide your developer with the necessary information to connect the website to your payment account.

No technical experience required - just follow each step carefully.

---

## What You'll Need

- A computer with internet access
- A valid email address
- Your business/bank details for receiving payments
- About 30 minutes to complete setup

---

## Part 1: Create Your Stripe Account

### Step 1: Sign Up for Stripe

1. Open your web browser and go to: **https://stripe.com**

2. Click the **"Start now"** button (usually in the top-right corner)

3. Fill in the registration form:
   - **Email address**: Use your business email
   - **Full name**: Your legal name
   - **Country**: Select your country
   - **Password**: Create a strong password

4. Click **"Create account"**

5. Check your email inbox for a verification email from Stripe

6. Click the verification link in the email

**Congratulations!** You now have a Stripe account.

---

### Step 2: Complete Your Business Profile

After verifying your email, Stripe will ask for business information:

1. **Business type**: Select one of:
   - Individual / Sole proprietor (if it's just you)
   - Company (if you have a registered business)

2. **Business details**:
   - Business name (or your name if individual)
   - Business website (your upcoming website URL)
   - Description: "Author selling digital book"

3. **Tax information**:
   - Tax ID / EIN (if you have one)
   - Or select "I don't have a tax ID" if individual

4. **Bank account** (where you'll receive payments):
   - Bank name
   - Routing number (9 digits)
   - Account number
   - Account holder name

5. Click **"Continue"** or **"Submit"**

**Important**: Stripe may ask you to verify your identity by uploading a photo ID (driver's license or passport). This is normal and required by law.

---

## Part 2: Create Your Book Product

Now you'll create the actual product (your book) in Stripe.

### Step 3: Navigate to Products

1. In your Stripe Dashboard, look at the left sidebar menu

2. Click on **"Products"** (it might be under "More" if you have a small screen)

3. Click the blue **"+ Add product"** button in the top-right

---

### Step 4: Set Up Book Details

You'll see a form to create your product. Fill it in exactly as shown:

**Product information:**

1. **Name**: `Turning Snowflakes into Diamonds`

2. **Description**:

   ```
   Transform your life with Michael Dugan's powerful guide to personal development.
   Digital book delivered instantly via email after purchase.
   ```

3. **Image** (optional but recommended):
   - Click **"Add image"**
   - Upload your book cover image (JPG or PNG)
   - This shows on the checkout page

**Pricing:**

4. **Pricing model**: Select **"Standard pricing"**

5. **Price**: Enter `14.99`

6. **Currency**: Select **"USD - US Dollar"** (or your currency)

7. **Billing period**: Select **"One time"** (not recurring)

**Additional options:**

8. Scroll down and find **"Tax code"** (optional)
   - Select "eBooks" or "Digital products" if available

9. Leave other fields as default

10. Click the blue **"Add product"** button at the top-right

---

### Step 5: Copy Your Product Information

After creating the product, Stripe will show you the product page. You need to copy two important codes:

1. **Product ID**:
   - Look for "Product ID" near the top of the page
   - It starts with `prod_` followed by random letters/numbers
   - Example: `prod_ABC123XYZ456`
   - Click the copy icon next to it
   - Paste it into a text document labeled "Stripe Product ID"

2. **Price ID**:
   - Scroll down to the "Pricing" section
   - You'll see your $14.99 price listed
   - Click on the price to expand details
   - Look for "Price ID"
   - It starts with `price_` followed by random letters/numbers
   - Example: `price_1ABC123DEF456GHI789`
   - Click the copy icon next to it
   - Paste it into the same text document labeled "Stripe Price ID"

**Save this document!** You'll send these codes to your developer later.

---

## Part 3: Get Your API Keys

API keys are secret codes that allow the website to communicate with your Stripe account.

### Step 6: Navigate to API Keys

1. In the left sidebar, click **"Developers"**

2. In the submenu that appears, click **"API keys"**

3. You'll see a page with two types of keys: **Test mode** and **Live mode**

---

### Step 7: Understand Test vs Live Mode

**Important concept:**

- **Test mode**: For testing without real money (we'll use this first)
- **Live mode**: For real customer payments (we'll set this up later)

At the top of the page, you'll see a toggle switch that says "Viewing test data".

**For now, make sure it's ON (blue)** - this means you're in test mode.

---

### Step 8: Copy Your TEST API Keys

While in **Test mode** (toggle is ON/blue):

1. **Publishable key (Test)**:
   - Look for "Publishable key"
   - It starts with `pk_test_`
   - Click **"Reveal test key"** if it's hidden
   - Click the copy icon
   - Paste into your text document labeled "Publishable Key (TEST)"

2. **Secret key (Test)**:
   - Look for "Secret key"
   - It starts with `sk_test_`
   - Click **"Reveal test key"**
   - **IMPORTANT**: This is sensitive! Don't share it publicly
   - Click the copy icon
   - Paste into your text document labeled "Secret Key (TEST)"

---

### Step 9: Copy Your LIVE API Keys

Now switch to **Live mode** (for real payments):

1. At the top of the page, toggle the "Viewing test data" switch to OFF (it will turn gray/white)

2. The page will reload showing your live API keys

3. **Publishable key (Live)**:
   - Starts with `pk_live_`
   - Click **"Reveal live key"** if needed
   - Click the copy icon
   - Paste into your text document labeled "Publishable Key (LIVE)"

4. **Secret key (Live)**:
   - Starts with `sk_live_`
   - Click **"Reveal live key"**
   - **VERY IMPORTANT**: Guard this like a password!
   - Click the copy icon
   - Paste into your text document labeled "Secret Key (LIVE)"

---

## Part 4: Configure Automatic Tax (Optional but Recommended)

Stripe can automatically calculate sales tax for you in different states/countries.

### Step 10: Enable Automatic Tax

1. In the left sidebar, click **"Settings"**

2. Click **"Tax"** in the submenu

3. Click the **"Enable"** button for automatic tax collection

4. Select the locations where you want to collect tax:
   - **United States**: Check the box
   - **Specific states**: Choose "All states" or select specific states
   - **Other countries**: Add if you sell internationally

5. Click **"Save"**

This ensures your customers pay the correct tax amount automatically.

---

## Part 5: Set Up Business Information

### Step 11: Add Your Business Details

This information appears on customer receipts and invoices.

1. In the left sidebar, click **"Settings"**

2. Click **"Business settings"**

3. Fill in:
   - **Business name**: Your business or author name
   - **Support email**: Where customers can reach you
   - **Support phone**: Your phone number (optional)

4. Click **"Address"** and enter:
   - Street address
   - City, State, ZIP
   - Country

5. Click **"Save"**

---

## Part 6: Verify Your Email Settings

### Step 12: Check Email Notifications

Stripe sends email receipts to customers and notifications to you.

1. In **Settings**, click **"Emails"**

2. Under **"Customer emails"**, make sure these are enabled:
   - ✅ Successful payments
   - ✅ Failed payments
   - ✅ Receipts

3. Under **"Team emails"**, enter your email for:
   - ✅ Successful payments
   - ✅ Failed payments
   - ✅ Disputes

4. Click **"Save"**

---

## Part 7: Understand Your Dashboard

### Step 13: Familiarize Yourself with Key Pages

Here's where to find important information:

**Left Sidebar Menu:**

- **Home**: Overview of your sales and activity
- **Payments**: See all successful and failed payments
- **Customers**: List of people who bought from you
- **Products**: Your book and other products
- **Developers** → **API keys**: Your secret codes
- **Settings**: Business details and preferences

**Test Mode Toggle** (top of page):

- **ON** (blue): Test transactions (fake money)
- **OFF** (gray): Live transactions (real money)

**Always double-check which mode you're in!**

---

## Part 8: Testing Your Setup

Before going live, you should test the payment system.

### Step 14: Use Test Cards

When in **Test mode**, use these fake credit card numbers:

**Successful payment:**

- Card number: `4242 4242 4242 4242`
- Expiration: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Declined payment:**

- Card number: `4000 0000 0000 0002`
- (Use same expiration, CVC, ZIP as above)

Your developer will use these to test the checkout process before launching.

---

## Part 9: Preparing for Launch

### Step 15: Before Going Live Checklist

Before accepting real customer payments, verify:

- ✅ Bank account verified in Stripe
- ✅ Identity verification complete (if required)
- ✅ Business details filled in
- ✅ Tax settings configured
- ✅ Product created with correct price ($14.99)
- ✅ Email notifications enabled
- ✅ Developer has tested in Test mode
- ✅ You understand how to view payments in dashboard

### Step 16: Monitor Your First Transactions

Once live:

1. Check your Stripe Dashboard daily for the first week

2. Look for:
   - Successful payments (appear under "Payments")
   - Customer emails (match delivery of book)
   - Any failed payments or disputes

3. Payments appear in your bank account in 2-7 business days (Stripe's standard payout schedule)

---

## Part 10: Send Information to Your Developer

### Step 17: Compile Your Codes

Your developer needs these 6 pieces of information. Create a document with:

```
STRIPE ACCOUNT INFORMATION
==========================

Product Details:
- Product ID: prod_XXXxxxxXXXxxx
- Price ID: price_1XXXxxxXXXxxx

Test Mode Keys (for development):
- Publishable Key (TEST): pk_test_51XXXxxxXXXxxx
- Secret Key (TEST): sk_test_51XXXxxxXXXxxx

Live Mode Keys (for production):
- Publishable Key (LIVE): pk_live_51XXXxxxXXXxxx
- Secret Key (LIVE): sk_live_51XXXxxxXXXxxx

Account Status:
- Business verification: [Complete / Pending]
- Bank account verified: [Yes / No]
- Ready for live payments: [Yes / No]
```

### Step 18: Securely Share the Information

**IMPORTANT SECURITY NOTES:**

1. **Never share Secret Keys via:**
   - Regular email
   - Text message
   - Social media
   - Public chat apps

2. **Safe sharing methods:**
   - Encrypted email (ProtonMail, Tutanota)
   - Password-protected document (share password separately)
   - Secure file sharing service (Dropbox with password)

3. **Recommended approach:**
   - Put all information in a password-protected PDF or Word document
   - Use the same password you used for your Google account (I already know it)
   - Email the document to your developer
   - If you choose a different password, send it via text message or separate email. Don't refer to it as the "Stripe account password" - just send it as is.

---

## Common Questions

### Q: How much does Stripe charge?

**A:** Stripe takes 2.9% + $0.30 per successful transaction.

Example: $14.99 book sale

- Stripe fee: $0.73
- You receive: $14.26

### Q: When do I get paid?

**A:** Stripe transfers money to your bank account automatically:

- **First payout**: 7-14 days after first sale (Stripe's security measure)
- **Ongoing payouts**: Every 2 days (or weekly, configurable in Settings)

### Q: What if a customer wants a refund?

**A:** You can issue refunds in the Stripe Dashboard:

1. Go to **Payments**
2. Find the transaction
3. Click **"Refund"**
4. Enter amount (full or partial)
5. Click **"Refund"**

The customer gets their money back in 5-10 days.

### Q: Can I change the book price later?

**A:** Yes, but you'll need to:

1. Create a new price in Stripe (under your product)
2. Get the new Price ID
3. Send it to your developer to update the website

### Q: What's the difference between Test and Live mode?

**A:**

- **Test mode**: Fake transactions using test card numbers (for testing)
- **Live mode**: Real transactions with real credit cards (for customers)

Always test first, then switch to live when ready!

### Q: Is my customer's payment information secure?

**A:** Yes! Stripe is PCI-compliant and used by millions of businesses worldwide. Credit card details never touch your website - Stripe handles everything securely.

### Q: What if I have problems?

**A:** Stripe has excellent support:

- **Help docs**: https://stripe.com/docs
- **Support email**: support@stripe.com
- **Live chat**: Available in your Stripe Dashboard (bottom-right corner)

---

## Quick Reference Card

Print or save this for easy reference:

```
┌─────────────────────────────────────────────────────┐
│            STRIPE QUICK REFERENCE                   │
├─────────────────────────────────────────────────────┤
│ Dashboard: https://dashboard.stripe.com            │
│ View payments: Dashboard → Payments                │
│ View customers: Dashboard → Customers              │
│ Change settings: Dashboard → Settings              │
│ Get API keys: Dashboard → Developers → API keys    │
│                                                     │
│ Test card: 4242 4242 4242 4242                     │
│ Product price: $14.99 one-time                     │
│ Stripe fee: 2.9% + $0.30 per sale                  │
│ Payout schedule: Every 2 days to bank              │
│                                                     │
│ Support: support@stripe.com                        │
│ Help: stripe.com/docs                              │
└─────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### Issue: Can't find the Product ID

**Solution:**

1. Go to **Products** in left sidebar
2. Click on "Turning Snowflakes into Diamonds"
3. The Product ID is at the top of the page (starts with `prod_`)

### Issue: Can't find the Price ID

**Solution:**

1. Go to **Products** → Click on your book
2. Scroll to "Pricing" section
3. Click on the $14.99 price
4. The Price ID appears (starts with `price_`)

### Issue: Can't reveal Secret Key

**Solution:**

1. Make sure you're logged in
2. Go to **Developers** → **API keys**
3. Click the gray **"Reveal test key"** or **"Reveal live key"** button
4. If it asks for your password, enter it

### Issue: "Your account is restricted"

**Solution:**

- Stripe may need additional verification
- Check your email for requests from Stripe
- Common requests: Photo ID, business documents, or answering questions about your business
- Complete verification in **Settings** → **Business settings**

### Issue: Payments not appearing in bank account

**Solution:**

1. Check **Payouts** in your dashboard
2. First payout takes 7-14 days
3. Verify bank account details in **Settings** → **Bank accounts**
4. Contact Stripe support if it's been longer than 14 days

---

## Next Steps After Setup

Once you've completed this guide:

1. ✅ Save all your Stripe codes securely
2. ✅ Send the information to your developer using a secure method
3. ✅ Wait for your developer to integrate the payment system
4. ✅ Test the checkout process in Test mode
5. ✅ Switch to Live mode when ready to accept real payments
6. ✅ Monitor your dashboard for the first few sales

**Congratulations!** Your Stripe account is ready to accept book sales.

---

## Additional Resources

**Official Stripe Resources:**

- Stripe Help Center: https://support.stripe.com
- Video tutorials: https://stripe.com/resources
- Getting started guide: https://stripe.com/docs/payments/checkout

**Contact:**

- Questions about Stripe setup: support@stripe.com
- Questions about website integration: Contact your developer
- Technical Stripe issues: Live chat in Stripe Dashboard

---

**Document Version:** 1.0
**Last Updated:** 15 November 2025
**For:** Becoming Diamond Book Sales Setup
