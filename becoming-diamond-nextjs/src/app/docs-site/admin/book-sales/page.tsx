import { DocsPage } from "@/components/docs/docs-page";
import Link from "next/link";

export default function BookSalesPage() {
  return (
    <DocsPage
      title="Managing Book Sales"
      description="How to view orders, revenue, and manage book purchases through Stripe"
    >
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-6">
        <p className="text-sm text-neutral-300">
          <strong>Primary Revenue Stream:</strong> Book sales are the main source of revenue
          for the Becoming Diamond platform. This guide explains how to access sales data,
          manage orders, and understand the purchase flow.
        </p>
      </div>

      <h2>Overview</h2>
      <p>
        The Diamond Manifesto book is sold as a digital download for $14.99 through the platform's
        book sales page. All payment processing, order management, and revenue tracking is
        handled through <strong>Stripe</strong>, a secure payment platform.
      </p>

      <h3>What Happens When Someone Purchases</h3>
      <p>
        Here's the complete purchase flow:
      </p>
      <ol>
        <li>Customer visits the <Link href="/book" className="text-primary hover:underline">/book</Link> page</li>
        <li>Customer clicks "Purchase Now" and enters payment information</li>
        <li>Stripe processes the payment securely ($14.99 charge)</li>
        <li>Upon successful payment:
          <ul>
            <li>Customer is redirected to a success page</li>
            <li>Customer receives immediate access to download the book (digital PDF/ePub)</li>
            <li>Order is recorded in Stripe Dashboard</li>
            <li>Revenue is deposited to your connected bank account (automatic, 2-7 business days)</li>
            <li>You can view the transaction details in Stripe Dashboard</li>
          </ul>
        </li>
      </ol>

      <h2>Accessing Stripe Dashboard</h2>
      <p>
        The Stripe Dashboard is your central hub for managing all book sales, revenue, and
        customer orders.
      </p>

      <h3>How to Log In</h3>
      <ol>
        <li>Go to <a href="https://dashboard.stripe.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://dashboard.stripe.com</a></li>
        <li>Enter your email address associated with the Stripe account</li>
        <li>Enter your password (or use email verification if enabled)</li>
        <li>Complete two-factor authentication if prompted</li>
      </ol>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>First Time Login?</strong> If you don't have your Stripe login credentials,
          contact your developer. They can help you access the account or set up your own
          login credentials.
        </p>
      </div>

      <h3>Dashboard Overview</h3>
      <p>
        When you log in to Stripe, you'll see the main dashboard with:
      </p>
      <ul>
        <li><strong>Revenue Overview</strong>: Total revenue, recent payments, balance</li>
        <li><strong>Recent Payments</strong>: List of latest transactions</li>
        <li><strong>Balance</strong>: Funds available for payout to your bank account</li>
        <li><strong>Quick Links</strong>: Navigation to payments, customers, products, reports</li>
      </ul>

      <h2>Viewing Orders and Purchases</h2>

      <h3>Finding All Transactions</h3>
      <p>
        To view all book purchases:
      </p>
      <ol>
        <li>Click <strong>"Payments"</strong> in the left sidebar</li>
        <li>You'll see a list of all transactions, including:
          <ul>
            <li>Date and time of purchase</li>
            <li>Amount ($14.99)</li>
            <li>Customer email</li>
            <li>Payment status (Succeeded, Failed, Refunded)</li>
            <li>Payment method (card type, last 4 digits)</li>
          </ul>
        </li>
      </ol>

      <h3>Viewing Individual Order Details</h3>
      <p>
        To see more details about a specific purchase:
      </p>
      <ol>
        <li>Click on any payment in the Payments list</li>
        <li>The detail page shows:
          <ul>
            <li>Full customer information (name, email, billing address)</li>
            <li>Payment method details</li>
            <li>Transaction timeline</li>
            <li>Receipt (can be downloaded or emailed)</li>
            <li>Refund options (if needed)</li>
          </ul>
        </li>
      </ol>

      <h3>Searching for Specific Orders</h3>
      <p>
        To find a specific customer's purchase:
      </p>
      <ol>
        <li>Go to the Payments page</li>
        <li>Use the search box at the top to search by:
          <ul>
            <li>Customer email</li>
            <li>Customer name</li>
            <li>Amount</li>
            <li>Payment ID</li>
          </ul>
        </li>
        <li>Use the filters to narrow by date range or status</li>
      </ol>

      <h2>Revenue Reports and Analytics</h2>

      <h3>Viewing Revenue Summary</h3>
      <p>
        To see your total revenue:
      </p>
      <ol>
        <li>The dashboard homepage shows:
          <ul>
            <li><strong>Total Volume</strong>: All-time revenue from book sales</li>
            <li><strong>This Month</strong>: Revenue in the current calendar month</li>
            <li><strong>Today</strong>: Revenue from today</li>
          </ul>
        </li>
        <li>You can change the date range using the date picker at the top right</li>
      </ol>

      <h3>Detailed Revenue Reports</h3>
      <p>
        For comprehensive revenue analysis:
      </p>
      <ol>
        <li>Click <strong>"Reports"</strong> in the left sidebar</li>
        <li>Choose from pre-built reports:
          <ul>
            <li><strong>Balance</strong>: Funds available for payout</li>
            <li><strong>Payouts</strong>: History of bank transfers</li>
            <li><strong>Payments</strong>: Revenue by time period</li>
            <li><strong>Sales</strong>: Product-specific sales data</li>
          </ul>
        </li>
        <li>Download reports as CSV for Excel/spreadsheet analysis</li>
      </ol>

      <h3>Understanding Your Balance</h3>
      <p>
        Stripe holds funds briefly before depositing to your bank account:
      </p>
      <ul>
        <li><strong>Pending Balance</strong>: Revenue from recent sales (1-7 days old)</li>
        <li><strong>Available Balance</strong>: Funds ready to be paid out to your bank</li>
        <li><strong>Payout Schedule</strong>: Automatic transfers to your bank (usually daily or weekly)</li>
      </ul>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-300">
          <strong>Note:</strong> New Stripe accounts may have a longer hold period (7-14 days)
          for the first few payments as a security measure. This normalizes after a short period.
        </p>
      </div>

      <h2>Book Fulfillment (Digital Download)</h2>

      <h3>How Customers Receive the Book</h3>
      <p>
        After a successful purchase:
      </p>
      <ol>
        <li>Customer is redirected to a <strong>Success Page</strong> with download link</li>
        <li>Download link provides access to:
          <ul>
            <li>PDF version of The Diamond Manifesto</li>
            <li>Optional: ePub version (if configured)</li>
            <li>Optional: Additional bonus materials</li>
          </ul>
        </li>
        <li>Customer can download immediately or bookmark the link for later</li>
      </ol>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>File Storage:</strong> Book files are hosted securely and delivered via
          Stripe or a CDN. Contact your developer if you need to update the book file or
          add bonus materials.
        </p>
      </div>

      <h3>Re-Sending Download Links</h3>
      <p>
        If a customer loses their download link:
      </p>
      <ol>
        <li>Find their payment in Stripe Dashboard</li>
        <li>Click on the payment to view details</li>
        <li>Click <strong>"Send receipt"</strong> to email them a receipt with order details</li>
        <li>Alternatively, contact your developer to manually provide the download link</li>
      </ol>

      <h2>Customer Support for Failed Purchases</h2>

      <h3>Common Issues and Solutions</h3>

      <h4>Payment Declined</h4>
      <p>
        If a customer reports their payment was declined:
      </p>
      <ol>
        <li>Check Stripe Dashboard for the failed payment attempt</li>
        <li>Common reasons for decline:
          <ul>
            <li>Insufficient funds</li>
            <li>Card expired</li>
            <li>Incorrect card details entered</li>
            <li>Bank fraud prevention blocking the charge</li>
          </ul>
        </li>
        <li>Advise customer to:
          <ul>
            <li>Try a different payment method</li>
            <li>Contact their bank to authorize the charge</li>
            <li>Double-check card details are entered correctly</li>
          </ul>
        </li>
      </ol>

      <h4>Charge Succeeded but No Download Link</h4>
      <p>
        If a customer paid but didn't receive their download:
      </p>
      <ol>
        <li>Verify the payment in Stripe Dashboard (look for "Succeeded" status)</li>
        <li>Check that the success page redirect is working properly</li>
        <li>Contact your developer to:
          <ul>
            <li>Check webhook configuration</li>
            <li>Manually send the download link</li>
            <li>Verify the success page URL</li>
          </ul>
        </li>
      </ol>

      <h4>Processing Refunds</h4>
      <p>
        If you need to refund a purchase:
      </p>
      <ol>
        <li>Go to the Payments page in Stripe Dashboard</li>
        <li>Find and click on the payment to refund</li>
        <li>Click <strong>"Refund payment"</strong> in the top right</li>
        <li>Enter the refund amount:
          <ul>
            <li>Full refund: $14.99</li>
            <li>Partial refund: Enter custom amount</li>
          </ul>
        </li>
        <li>Add a reason for the refund (internal note)</li>
        <li>Click <strong>"Refund"</strong> to process</li>
        <li>Customer receives refund in 5-10 business days (varies by bank)</li>
      </ol>

      <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 my-6">
        <p className="text-sm text-neutral-300">
          <strong>Refund Policy:</strong> Stripe charges are non-refundable from Stripe's
          perspective (you still pay processing fees), but you can refund the customer.
          Consider your refund policy carefully.
        </p>
      </div>

      <h2>Updating Book Price or Product Details</h2>

      <h3>Changing the Book Price</h3>
      <p>
        To change the book price from $14.99 to a different amount:
      </p>
      <ol>
        <li>In Stripe Dashboard, go to <strong>"Products"</strong> in the left sidebar</li>
        <li>Find "The Diamond Manifesto" product</li>
        <li>Click on the product to view details</li>
        <li>You can:
          <ul>
            <li>Add a new price (creates a new price option)</li>
            <li>Archive the old price</li>
          </ul>
        </li>
        <li><strong>Important:</strong> Changing the price in Stripe is only half the process. You must also update the website code to reference the new price ID.</li>
      </ol>

      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 my-6">
        <p className="text-sm text-neutral-300">
          <strong>Developer Required:</strong> Price changes require updating the website code
          to use the new Stripe Price ID. Contact your developer to complete a price change.
          Do not archive or delete the current price until the website is updated.
        </p>
      </div>

      <h3>Updating Product Information</h3>
      <p>
        You can update product details in Stripe:
      </p>
      <ul>
        <li><strong>Product Name</strong>: The display name ("The Diamond Manifesto")</li>
        <li><strong>Description</strong>: Product description for receipts and invoices</li>
        <li><strong>Images</strong>: Product images shown in Stripe checkout (if used)</li>
        <li><strong>Metadata</strong>: Internal notes and tags</li>
      </ul>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>Note:</strong> Most product information in Stripe is for internal tracking.
          The book sales page on the website (/book) displays its own content, which is managed
          separately through the website code.
        </p>
      </div>

      <h2>Viewing Customer Information</h2>

      <h3>Customer List</h3>
      <p>
        To see all customers who have purchased:
      </p>
      <ol>
        <li>Click <strong>"Customers"</strong> in the left sidebar</li>
        <li>View a list of all customers with:
          <ul>
            <li>Name and email</li>
            <li>Total amount spent</li>
            <li>Number of payments</li>
            <li>Date of first payment</li>
          </ul>
        </li>
        <li>Click on a customer to see their complete payment history</li>
      </ol>

      <h3>Exporting Customer Data</h3>
      <p>
        To export customer email addresses for marketing:
      </p>
      <ol>
        <li>Go to the Customers page</li>
        <li>Click <strong>"Export"</strong> at the top right</li>
        <li>Choose export format:
          <ul>
            <li>CSV (for Excel/spreadsheet)</li>
            <li>Select which fields to include (email, name, etc.)</li>
          </ul>
        </li>
        <li>Download the file</li>
      </ol>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-300">
          <strong>Marketing Tip:</strong> Customers who purchased the book are highly engaged
          with your content. Consider creating an email sequence specifically for book buyers
          to guide them through the 30-Day Sprint or promote additional offerings.
        </p>
      </div>

      <h2>Bank Account and Payouts</h2>

      <h3>Viewing Payout History</h3>
      <p>
        To see when money was transferred to your bank:
      </p>
      <ol>
        <li>Click <strong>"Payouts"</strong> in the left sidebar</li>
        <li>See a list of all bank transfers:
          <ul>
            <li>Payout date</li>
            <li>Amount transferred</li>
            <li>Status (Paid, In Transit, Failed)</li>
            <li>Arrival date (when funds appear in your bank)</li>
          </ul>
        </li>
        <li>Click on a payout to see which payments it includes</li>
      </ol>

      <h3>Payout Schedule</h3>
      <p>
        Stripe automatically transfers funds to your bank account:
      </p>
      <ul>
        <li><strong>Daily</strong>: Every business day (most common)</li>
        <li><strong>Weekly</strong>: Once per week on a specific day</li>
        <li><strong>Monthly</strong>: Once per month on a specific day</li>
      </ul>

      <p>
        To view or change your payout schedule:
      </p>
      <ol>
        <li>Click <strong>"Settings"</strong> in the left sidebar</li>
        <li>Click <strong>"Bank accounts and scheduling"</strong></li>
        <li>View your current payout schedule</li>
        <li>Update if needed (usually daily is best for consistent cash flow)</li>
      </ol>

      <h3>Updating Bank Account</h3>
      <p>
        To change which bank account receives payouts:
      </p>
      <ol>
        <li>Go to Settings → Bank accounts and scheduling</li>
        <li>Click <strong>"Add bank account"</strong></li>
        <li>Enter new bank account details:
          <ul>
            <li>Account holder name</li>
            <li>Routing number</li>
            <li>Account number</li>
          </ul>
        </li>
        <li>Verify the bank account (Stripe sends 2 small test deposits)</li>
        <li>Once verified, set as default payout account</li>
      </ol>

      <h2>Email Notifications</h2>

      <h3>Receiving Payment Alerts</h3>
      <p>
        Stripe can email you when events occur:
      </p>
      <ol>
        <li>Go to Settings → Email notifications</li>
        <li>Enable notifications for:
          <ul>
            <li><strong>Successful payments</strong>: Know immediately when a book is sold</li>
            <li><strong>Failed payments</strong>: Alert when a charge doesn't go through</li>
            <li><strong>Refunds</strong>: Confirmation when refunds are issued</li>
            <li><strong>Payouts</strong>: Know when money is sent to your bank</li>
          </ul>
        </li>
        <li>Choose which email address receives these notifications</li>
      </ol>

      <h2>Security and Access</h2>

      <h3>Two-Factor Authentication</h3>
      <p>
        Protect your Stripe account with two-factor authentication (2FA):
      </p>
      <ol>
        <li>Go to Settings → Security</li>
        <li>Enable two-factor authentication</li>
        <li>Use an authenticator app (Google Authenticator, Authy, etc.)</li>
        <li>You'll need the authentication code every time you log in</li>
      </ol>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-300">
          <strong>Highly Recommended:</strong> Enable two-factor authentication to protect
          your revenue data and prevent unauthorized access to your Stripe account.
        </p>
      </div>

      <h3>Adding Team Members</h3>
      <p>
        To give someone else access to Stripe (assistant, bookkeeper, etc.):
      </p>
      <ol>
        <li>Go to Settings → Team and security</li>
        <li>Click <strong>"Invite team member"</strong></li>
        <li>Enter their email address</li>
        <li>Choose their permission level:
          <ul>
            <li><strong>Administrator</strong>: Full access (use carefully)</li>
            <li><strong>Developer</strong>: Technical access for developer</li>
            <li><strong>Analyst</strong>: View-only access to reports</li>
            <li><strong>Support</strong>: Limited access for customer support</li>
          </ul>
        </li>
        <li>They'll receive an email invitation to create their own login</li>
      </ol>

      <h2>Getting Help</h2>

      <h3>Stripe Support</h3>
      <p>
        For issues with Stripe itself (payments not processing, technical errors, etc.):
      </p>
      <ul>
        <li><strong>Stripe Support</strong>: Click "?" icon in Stripe Dashboard</li>
        <li><strong>Live Chat</strong>: Available 24/7 for urgent issues</li>
        <li><strong>Help Center</strong>: <a href="https://support.stripe.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">support.stripe.com</a></li>
        <li><strong>Email</strong>: support@stripe.com</li>
      </ul>

      <h3>Developer Support</h3>
      <p>
        For issues with the website integration or custom features:
      </p>
      <ul>
        <li>Contact your developer (see <Link href="/docs-site/support" className="text-primary hover:underline">Support page</Link>)</li>
        <li>Common scenarios requiring developer:
          <ul>
            <li>Changing book price</li>
            <li>Updating download file</li>
            <li>Webhook configuration issues</li>
            <li>Custom receipt templates</li>
            <li>Payment flow customization</li>
          </ul>
        </li>
      </ul>

      <h2>Best Practices</h2>
      <ul>
        <li><strong>Check Dashboard Daily</strong>: Review new sales and customer activity</li>
        <li><strong>Monitor Refund Requests</strong>: Respond quickly to customer issues</li>
        <li><strong>Export Monthly Reports</strong>: Keep records for accounting and taxes</li>
        <li><strong>Keep Bank Info Updated</strong>: Ensure payouts go to the correct account</li>
        <li><strong>Enable Email Alerts</strong>: Stay informed of all transactions</li>
        <li><strong>Review Failed Payments</strong>: Look for patterns that might indicate checkout issues</li>
        <li><strong>Maintain Customer Data</strong>: Export and back up customer lists regularly</li>
      </ul>

      <h2>Tax and Accounting Considerations</h2>
      <p>
        Important reminders for financial management:
      </p>
      <ul>
        <li><strong>Income Tax</strong>: Book sales revenue is taxable income</li>
        <li><strong>Monthly Reports</strong>: Export reports for your accountant</li>
        <li><strong>1099-K Form</strong>: Stripe sends this tax form if you process over $20,000 (US)</li>
        <li><strong>Sales Tax</strong>: Digital products may have sales tax requirements in some jurisdictions</li>
        <li><strong>Consulting an Accountant</strong>: Consider professional tax advice for your specific situation</li>
      </ul>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>Disclaimer:</strong> This guide provides general information about managing
          book sales. For specific tax or accounting advice, consult with a qualified professional
          familiar with your jurisdiction.
        </p>
      </div>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <Link href="/docs-site/admin/lead-management" className="text-primary hover:underline">
            Lead Management
          </Link>{" "}
          - Learn how to access and export email leads
        </li>
        <li>
          <Link href="/docs-site/support" className="text-primary hover:underline">
            Support
          </Link>{" "}
          - Get help and contact information
        </li>
        <li>
          <Link href="/docs-site/admin/cms-overview" className="text-primary hover:underline">
            Back to Admin Guide
          </Link>
        </li>
      </ul>
    </DocsPage>
  );
}
