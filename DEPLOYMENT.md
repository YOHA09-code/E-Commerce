# 🚀 Deployment Guide

This guide will help you deploy the EthioShop e-commerce platform to Vercel.

## Prerequisites

- GitHub account
- Vercel account
- PostgreSQL database (Neon, Supabase, or Railway)
- Cloudinary account
- Chapa API credentials
- Stripe API credentials

## Step 1: Database Setup

### Option A: Neon (Recommended)

1. Go to [Neon](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string
4. Update your environment variables

### Option B: Supabase

1. Go to [Supabase](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

### Option C: Railway

1. Go to [Railway](https://railway.app) and create an account
2. Create a new PostgreSQL service
3. Copy the connection string

## Step 2: Vercel Deployment

### Automatic Deployment (Recommended)

1. **Fork the repository** to your GitHub account
2. **Connect to Vercel**:

   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository and click "Import"

3. **Configure Environment Variables**:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@host:port/database"

   # NextAuth.js
   NEXTAUTH_URL="https://your-domain.vercel.app"
   NEXTAUTH_SECRET="your-super-secret-key"

   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"

   # Payments
   CHAPA_SECRET_KEY="your-chapa-secret-key"
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

   # Email Service
   EMAIL_SERVER_USER="your-email"
   EMAIL_SERVER_PASSWORD="your-password"
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT="587"
   EMAIL_FROM="noreply@yourdomain.com"

   # OAuth Providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   FACEBOOK_CLIENT_ID="your-facebook-client-id"
   FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"

   # App URL
   NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
   ```

4. **Deploy**: Vercel will automatically deploy your application

### Manual Deployment

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   vercel
   ```

4. **Set Environment Variables**:

   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_SECRET
   # ... add all other environment variables
   ```

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Step 3: Database Migration

After deployment, you need to run the database migrations:

1. **Connect to your database** and run:

   ```sql
   -- Create the database if it doesn't exist
   CREATE DATABASE ethiopian_ecommerce;
   ```

2. **Run Prisma migrations**:

   ```bash
   npx prisma migrate deploy
   ```

3. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

## Step 4: Configure Payment Gateways

### Chapa Setup

1. Go to [Chapa](https://chapa.co) and create an account
2. Get your API keys from the dashboard
3. Set up webhooks pointing to: `https://your-domain.vercel.app/api/payments/chapa/webhook`

### Stripe Setup

1. Go to [Stripe](https://stripe.com) and create an account
2. Get your API keys from the dashboard
3. Set up webhooks pointing to: `https://your-domain.vercel.app/api/payments/stripe/webhook`

## Step 5: Configure OAuth Providers

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-domain.vercel.app/api/auth/callback/google`

### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs:
   - `https://your-domain.vercel.app/api/auth/callback/facebook`

## Step 6: Configure Email Service

### Option A: Gmail SMTP

1. Enable 2-factor authentication on your Gmail account
2. Generate an app password
3. Use these settings:
   ```env
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT="587"
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   EMAIL_FROM="noreply@yourdomain.com"
   ```

### Option B: Resend (Recommended)

1. Go to [Resend](https://resend.com) and create an account
2. Get your API key
3. Use these settings:
   ```env
   RESEND_API_KEY="your-resend-api-key"
   EMAIL_FROM="noreply@yourdomain.com"
   ```

## Step 7: Configure Cloudinary

1. Go to [Cloudinary](https://cloudinary.com) and create an account
2. Get your cloud name, API key, and API secret
3. Add them to your environment variables

## Step 8: Domain Configuration (Optional)

1. **Add Custom Domain**:

   - Go to your Vercel dashboard
   - Click on your project
   - Go to Settings > Domains
   - Add your custom domain

2. **Configure DNS**:
   - Add a CNAME record pointing to your Vercel domain
   - Or use Vercel's nameservers

## Step 9: SSL and Security

Vercel automatically provides SSL certificates. Make sure to:

1. **Enable HTTPS** (automatic with Vercel)
2. **Configure Security Headers** (already configured in `vercel.json`)
3. **Set up monitoring** (optional):
   - Sentry for error tracking
   - Vercel Analytics for performance monitoring

## Step 10: Testing Production

1. **Test Authentication**:

   - Try signing up with email
   - Test social login (Google/Facebook)

2. **Test Payments**:

   - Test Chapa payments (use test mode)
   - Test Stripe payments (use test mode)

3. **Test PWA Features**:

   - Install the app on mobile
   - Test offline functionality

4. **Test Performance**:
   - Run Lighthouse audit
   - Check Core Web Vitals

## Troubleshooting

### Common Issues

1. **Database Connection Issues**:

   - Check your `DATABASE_URL`
   - Ensure your database is accessible from Vercel

2. **Authentication Issues**:

   - Verify `NEXTAUTH_SECRET` is set
   - Check OAuth provider configurations

3. **Payment Issues**:

   - Verify API keys are correct
   - Check webhook configurations

4. **Build Issues**:
   - Check environment variables
   - Verify all dependencies are installed

### Debugging

1. **Check Vercel Logs**:

   ```bash
   vercel logs
   ```

2. **Check Database Logs**:

   - Use your database provider's dashboard

3. **Test API Endpoints**:
   - Use tools like Postman or curl

## Monitoring and Maintenance

1. **Set up monitoring**:

   - Vercel Analytics
   - Sentry for error tracking
   - Database monitoring

2. **Regular backups**:

   - Database backups
   - Environment variable backups

3. **Security updates**:
   - Keep dependencies updated
   - Monitor security advisories

## Support

If you encounter issues:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Check the [Next.js documentation](https://nextjs.org/docs)
3. Check the [Prisma documentation](https://www.prisma.io/docs)
4. Create an issue in the repository

---

**Happy Deploying! 🚀**
