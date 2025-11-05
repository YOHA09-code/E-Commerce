<<<<<<< HEAD
# 🇪🇹 EthioShop - Ethiopian E-Commerce Platform

A production-ready, full-stack e-commerce platform specifically designed for the Ethiopian market, built with Next.js 14, React 18, TypeScript, and PostgreSQL.

## ✨ Features

### 🛍️ Core E-Commerce Features

- **Product Catalog**: Browse and search products with advanced filtering
- **Shopping Cart**: Persistent cart with Zustand state management
- **Checkout Process**: Dual currency support (ETB/USD) with multiple payment methods
- **Order Management**: Real-time order tracking and status updates
- **User Reviews**: Customer reviews and ratings system

### 🌍 Ethiopian Market Focus

- **Bilingual Support**: Full Amharic and English localization
- **Local Payments**: Chapa payment gateway integration for Ethiopian Birr (ETB)
- **International Payments**: Stripe and PayPal for USD transactions
- **Local Vendors**: Support for Ethiopian businesses and vendors
- **Cultural Adaptation**: Ethiopian market-specific features and workflows

### 🔐 Authentication & Authorization

- **Multi-Provider Auth**: Email/password, Google, and Facebook login
- **Role-Based Access**: Customer, Vendor, and Admin dashboards
- **Secure Sessions**: NextAuth.js with JWT tokens
- **Password Management**: Secure reset and recovery flows

### 📱 Modern User Experience

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **PWA Support**: Progressive Web App capabilities
- **SEO Optimized**: Dynamic meta tags and structured data
- **Dark Mode**: Theme switching support
- **Accessibility**: WCAG compliant components

### 🏪 Vendor Management

- **Vendor Dashboard**: Comprehensive product and sales management
- **Inventory Tracking**: Real-time stock levels and availability
- **Analytics**: Sales trends, top products, and revenue tracking
- **Bulk Operations**: CSV upload for product management

### 👨‍💼 Admin Features

- **User Management**: Customer and vendor account oversight
- **Order Management**: Complete order lifecycle management
- **Analytics Dashboard**: Business intelligence and reporting
- **Audit Logging**: Complete activity tracking for compliance

## 🚀 Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

### Backend

- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **API**: Next.js API Routes
- **File Storage**: Cloudinary
- **Email**: Resend/Nodemailer

### Payments

- **Ethiopian**: Chapa payment gateway
- **International**: Stripe + PayPal
- **Currency**: ETB (Ethiopian Birr) + USD

### Deployment

- **Hosting**: Vercel
- **Database**: PostgreSQL (Neon/Supabase)
- **CDN**: Cloudinary
- **Monitoring**: Sentry (optional)

## 📦 Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/ethiopian-ecommerce.git
   cd ethiopian-ecommerce
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp env.example .env.local
   ```

   Update the environment variables in `.env.local`:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/ethiopian_ecommerce"

   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-key"

   # OAuth Providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   FACEBOOK_CLIENT_ID="your-facebook-client-id"
   FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"

   # Payment Gateways
   CHAPA_SECRET_KEY="chapa_test_secret_key"
   STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
   STRIPE_PUBLIC_KEY="pk_test_your_stripe_public_key"

   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
   CLOUDINARY_API_KEY="your-cloudinary-api-key"
   CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
   ```

4. **Database Setup**

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Seed Database (Optional)**

   ```bash
   npm run seed
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application.

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema with the following main entities:

- **Users**: Customer profiles and authentication
- **Vendors**: Business profiles and verification
- **Products**: Catalog items with variants and inventory
- **Orders**: Purchase records and status tracking
- **Payments**: Transaction records and payment methods
- **Reviews**: Customer feedback and ratings
- **Categories**: Product organization and hierarchy
- **Audit Logs**: System activity tracking

## 🔧 API Routes

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/session` - Get current session

### Products

- `GET /api/products` - List products with filtering
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (vendor)
- `PUT /api/products/[id]` - Update product (vendor)
- `DELETE /api/products/[id]` - Delete product (vendor)

### Orders

- `GET /api/orders` - List user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/[id]` - Update order status
- `GET /api/orders/[id]` - Get order details

### Payments

- `POST /api/payments/chapa` - Process Chapa payment
- `POST /api/payments/stripe` - Process Stripe payment
- `POST /api/payments/webhook` - Payment webhooks

## 🌐 Localization

The platform supports both English and Amharic languages:

- **UI Elements**: All buttons, navigation, and forms
- **Product Information**: Names, descriptions, and reviews
- **Email Templates**: Notifications and confirmations
- **Admin Interface**: Dashboard and management tools

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**

   ```bash
   npx vercel
   ```

2. **Set Environment Variables**
   Add all required environment variables in the Vercel dashboard.

3. **Database Setup**

   - Use Neon, Supabase, or any PostgreSQL provider
   - Update `DATABASE_URL` in Vercel environment variables

4. **Deploy**
   ```bash
   npx vercel --prod
   ```

### Environment Variables for Production

Ensure all environment variables are set in your production environment:

- Database connection string
- NextAuth configuration
- OAuth provider credentials
- Payment gateway keys
- Cloudinary credentials
- Email service configuration

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 Performance

- **Image Optimization**: Next.js Image component with Cloudinary
- **Caching**: Redis for session caching (optional)
- **CDN**: Cloudinary for image delivery
- **Lazy Loading**: Component and route-based code splitting
- **SEO**: Dynamic meta tags and structured data

## 🔒 Security

- **Authentication**: Secure JWT tokens with NextAuth.js
- **Authorization**: Role-based access control
- **Data Validation**: Zod schema validation
- **SQL Injection**: Prisma ORM protection
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: NextAuth.js CSRF tokens

## 📈 Analytics

- **User Analytics**: Google Analytics integration
- **Business Intelligence**: Sales trends and reporting
- **Performance Monitoring**: Core Web Vitals tracking
- **Error Tracking**: Sentry integration (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment
- **Prisma** for the excellent ORM
- **shadcn/ui** for beautiful components
- **Ethiopian Developer Community** for inspiration

## 📞 Support

For support, email support@ethioshop.com or join our Discord community.

---

**Built with ❤️ for the Ethiopian market**
=======
# E-Commerce
E-Commerce Website for Ethiopia's Market
>>>>>>> 9e393c116b1f6657709b4221f318ffcdb5395e40
