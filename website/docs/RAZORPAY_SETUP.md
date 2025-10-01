# Razorpay Payment Integration Setup Guide

This guide will help you set up real payment processing for the Club Too High website using Razorpay.

## Prerequisites

1. **Razorpay Account**: Create an account at [razorpay.com](https://razorpay.com)
2. **Business Verification**: Complete KYC and business verification for live payments
3. **Test Credentials**: Get test API keys for development
4. **Live Credentials**: Get live API keys for production

## Step 1: Razorpay Dashboard Setup

### 1.1 Create Razorpay Account
1. Visit [razorpay.com](https://razorpay.com) and sign up
2. Complete email verification
3. Complete business verification (required for live payments)

### 1.2 Get API Keys
1. Go to Settings → API Keys
2. Generate Test API Keys for development
3. Generate Live API Keys for production (after business verification)

### 1.3 Configure Webhooks
1. Go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Select events:
   - `payment.authorized`
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
4. Generate webhook secret

## Step 2: Environment Configuration

Update your `.env.local` file with Razorpay credentials:

```bash
# Razorpay Test Configuration (for development)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_test_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# Razorpay Live Configuration (for production)
# NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id_here
# RAZORPAY_KEY_SECRET=your_live_secret_here
# RAZORPAY_WEBHOOK_SECRET=your_live_webhook_secret_here
```

**Security Notes:**
- Never commit `.env.local` to version control
- Use different keys for test and production
- Store production keys securely (use environment variables in deployment)

## Step 3: Database Migration

Run the SQL migration to add Razorpay fields to your Supabase database:

1. Open Supabase SQL Editor
2. Copy and paste the contents of `database/migrations/add_razorpay_fields.sql`
3. Execute the migration

### Key Database Changes:
- Added Razorpay-specific fields to bookings table
- Added indexes for better performance
- Added booking status constraints
- Created booking_details view

## Step 4: Testing the Integration

### 4.1 Test Cards (Use in Test Mode)
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
Name: Any name

Card Number: 5555 5555 5555 4444 (Mastercard)
Card Number: 3782 8224 6310 005 (American Express)
```

### 4.2 Test UPI (Use in Test Mode)
- UPI ID: `success@razorpay`
- UPI ID: `failure@razorpay` (for testing failures)

### 4.3 Test Wallets
- Paytm: Use any phone number
- PhonePe: Use any phone number

## Step 5: Production Deployment

### 5.1 Business Verification
1. Complete KYC documents
2. Provide business registration documents
3. Add bank account details
4. Wait for approval (usually 2-3 business days)

### 5.2 Go Live Checklist
- [ ] Business verification completed
- [ ] Live API keys generated
- [ ] Environment variables updated with live keys
- [ ] Webhook URLs updated to production domain
- [ ] SSL certificate installed
- [ ] Domain verification completed
- [ ] Settlement account configured

### 5.3 Environment Variables for Production
```bash
# Use these in your production environment
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_live_secret
RAZORPAY_WEBHOOK_SECRET=your_actual_webhook_secret
```

## Step 6: Important Configuration

### 6.1 Razorpay Dashboard Settings

**Payment Methods:**
- Enable Cards, UPI, Wallets, Net Banking
- Set minimum amount limits
- Configure payment timeouts

**Notifications:**
- Email notifications for successful payments
- SMS notifications for customers
- Webhook notifications for automated processing

**Security:**
- Enable 3D Secure for cards
- Set up fraud detection rules
- Configure risk thresholds

### 6.2 Next.js Configuration

Add to your `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['checkout.razorpay.com'],
  },
  async headers() {
    return [
      {
        source: '/api/payment/webhook',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://api.razorpay.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

## Step 7: Features Implemented

### 7.1 Payment Flow
1. User selects tickets and clicks "Pay"
2. Frontend calls `/api/payment/create-order`
3. Razorpay order created with booking entry
4. Razorpay checkout modal opens
5. User completes payment
6. Frontend calls `/api/payment/verify`
7. Payment verified and booking confirmed
8. Webhook confirms payment (backup verification)

### 7.2 Payment Methods Supported
- **Credit/Debit Cards**: Visa, Mastercard, RuPay, American Express
- **UPI**: All UPI apps (Google Pay, PhonePe, Paytm, etc.)
- **Wallets**: Paytm, PhonePe, Amazon Pay
- **Net Banking**: All major banks
- **EMI**: Available for eligible cards

### 7.3 Security Features
- PCI DSS compliant payment processing
- End-to-end encryption
- Webhook signature verification
- Payment signature verification
- Fraud detection and prevention

## Step 8: Monitoring and Maintenance

### 8.1 Payment Monitoring
- Monitor webhook deliveries in Razorpay dashboard
- Check payment failure rates
- Monitor settlement reports
- Set up alerts for failed payments

### 8.2 Error Handling
- Implement retry logic for failed webhooks
- Handle network timeouts gracefully
- Provide clear error messages to users
- Log payment errors for debugging

### 8.3 Regular Maintenance
- Update API keys before expiry
- Monitor Razorpay API status
- Keep payment amounts and tax rates updated
- Review and update payment methods

## Step 9: Troubleshooting

### Common Issues:

**Payment Fails with "Invalid Key"**
- Check if correct API keys are used
- Verify environment variables are loaded
- Ensure keys match the mode (test/live)

**Webhook Not Received**
- Check webhook URL is accessible
- Verify webhook secret matches
- Check server logs for errors
- Test webhook endpoint manually

**Amount Mismatch Error**
- Ensure amount is in paise (multiply by 100)
- Check for floating point precision issues
- Verify tax calculations are correct

**3D Secure Issues**
- Ensure proper 3D Secure handling
- Check if bank supports 3D Secure
- Verify SSL certificate is valid

## Step 10: Support and Resources

### Documentation
- [Razorpay API Docs](https://razorpay.com/docs/)
- [Razorpay Integration Guide](https://razorpay.com/docs/payments/)
- [Webhook Documentation](https://razorpay.com/docs/webhooks/)

### Support
- Razorpay Support: support@razorpay.com
- Developer Slack: Join Razorpay Developer Community
- Status Page: status.razorpay.com

### Testing Tools
- Webhook Testing: Use ngrok for local testing
- Payment Testing: Use Razorpay test cards
- API Testing: Use Postman collections

---

## Security Reminders

1. **Never expose secret keys** in client-side code
2. **Always verify payment signatures** server-side
3. **Use HTTPS** for all payment endpoints
4. **Validate webhook signatures** before processing
5. **Log payment attempts** for audit trails
6. **Implement rate limiting** on payment endpoints
7. **Keep dependencies updated** for security patches

## Next Steps

After successful implementation:
1. Implement email confirmations
2. Add SMS notifications
3. Create admin dashboard for payment monitoring
4. Implement refund functionality
5. Add payment analytics and reporting
6. Set up automated reconciliation