# Pixel Boba Client Portal Setup Guide

I've built out a complete, state-of-the-art client portal system with boba-inspired design. Here's what you need to set up to make it fully functional:

## 🎨 What's Been Built

### ✅ Complete Feature Set

- **Authentication System** with NextAuth.js (Google OAuth + credentials)
- **Client Portal Dashboard** with boba-themed progress indicators
- **Real-time Messaging** with file uploads and project-specific chats
- **Invoice Management** with Stripe payment integration
- **Digital Contract Signing** with signature canvas and PDF generation
- **File Sharing & Management** with drag-and-drop upload
- **Admin Panel** for managing clients, projects, contracts, and invoices
- **Notification System** with real-time alerts
- **Project Progress Tracking** with animated boba cup indicators
- **Responsive Design** optimized for all devices

### 🎯 Boba-Themed Features

- **Animated boba cup progress indicators** showing project completion with floating pearls
- **Boba-inspired loading animations** for page transitions
- **Consistent design language** with "brewing" metaphors throughout
- **Custom color palette** using taro, milk tea, and brown sugar themes

## 🚀 Setup Instructions

### 1. Database Setup (PostgreSQL)

First, set up a PostgreSQL database. You can use:

- **Supabase** (recommended - has free tier)
- **PlanetScale**
- **Railway**
- **Local PostgreSQL**

**For Supabase:**

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your database URL from Settings > Database
3. Update your `.env.local` file

### 2. Environment Variables

Update your `.env.local` file with these values:

```env
# Database (replace with your actual database URL)
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-nextauth-key-here

# Google OAuth (optional - for Google login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Resend)
RESEND_API_KEY=re_your_resend_api_key_here

# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Real-time (Pusher)
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=us2
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=us2

# File Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Digital Signatures (DocuSign - optional)
DOCUSIGN_INTEGRATION_KEY=your-integration-key
DOCUSIGN_USER_ID=your-user-id
DOCUSIGN_ACCOUNT_ID=your-account-id
```

### 3. Database Migration

Run Prisma migrations to set up your database:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database with sample data
npx prisma db seed
```

### 4. External Service Setup

#### Stripe (Payment Processing)

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard > Developers > API keys
3. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
4. Add webhook events: `checkout.session.completed`, `invoice.payment_succeeded`

#### Resend (Email)

1. Create account at [resend.com](https://resend.com)
2. Get API key from API Keys section
3. Verify your domain for production use

#### Pusher (Real-time)

1. Create account at [pusher.com](https://pusher.com)
2. Create new Channels app
3. Get credentials from App Keys section

#### Cloudinary (File Storage)

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get credentials from Dashboard > Settings > Access Keys
3. Configure upload presets if needed

#### Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### 5. API Routes Setup

The system includes complete API routes for:

- `/api/auth/[...nextauth]` - Authentication
- `/api/portal/*` - Client portal endpoints
- `/api/admin/*` - Admin panel endpoints
- `/api/webhooks/*` - Payment and notification webhooks

### 6. File Structure

```
📁 app/
├── 📁 portal/ - Client portal pages
├── 📁 admin/ - Admin panel pages
└── 📁 api/ - API routes

📁 components/
├── 📁 portal/ - Client portal components
├── 📁 admin/ - Admin panel components
└── 📁 loading/ - Boba loading animations

📁 lib/ - Utilities and configurations
📁 types/ - TypeScript type definitions
📁 prisma/ - Database schema and migrations
```

## 🎯 Key Features Breakdown

### Client Portal (`/portal`)

- **Dashboard**: Overview with active project progress and stats
- **Messages**: Real-time chat with file sharing per project
- **Invoices**: View, pay, and download invoices with Stripe integration
- **Contracts**: Digital signing with signature canvas
- **Files**: Upload, organize, and share project files
- **Notifications**: Real-time alerts and updates

### Admin Panel (`/admin`)

- **Overview**: Analytics dashboard with revenue tracking
- **Projects**: Create and manage client projects with boba progress tracking
- **Clients**: Manage client accounts and information
- **Contracts**: Create, send, and track contract signatures
- **Invoices**: Generate and send invoices with payment tracking
- **Settings**: Configure system settings, payments, and notifications

### Boba Progress Indicators

- **Visual Progress**: Animated boba cups that fill up based on project completion
- **Status-based Coloring**: Different colors for different project phases
- **Floating Pearls**: Dynamic pearl animations that increase with progress
- **Size Variants**: Small, medium, and large indicators for different contexts

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Format code
npm run format
```

## 🎨 Design System

The portal uses a cohesive boba-inspired design with:

- **Colors**: Taro purple, milk tea beige, brown sugar orange
- **Typography**: Plus Jakarta Sans for headings, Inter for body text
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React for consistent iconography
- **Components**: Radix UI for accessible primitives

## 🚀 Going Live

### Database

- Use production PostgreSQL (Supabase, PlanetScale, etc.)
- Update `DATABASE_URL` with production database

### Hosting

- **Vercel** (recommended) - Zero config deployment
- **Netlify** - Alternative with great DX
- **Railway** - Full-stack platform with databases

### Domain & SSL

- Configure custom domain
- SSL certificates (automatic with Vercel/Netlify)
- Update `NEXTAUTH_URL` and webhook URLs

### Environment Variables

- Set all production environment variables
- Use separate API keys for production
- Configure webhook endpoints with your live domain

## 🎯 Next Steps

1. **Setup Database**: Choose and configure PostgreSQL provider
2. **Configure Services**: Set up Stripe, Resend, Pusher, and Cloudinary
3. **Test Locally**: Run migrations and test all features
4. **Deploy**: Push to Vercel or your preferred hosting platform
5. **Go Live**: Configure production environment variables

The system is now ready to provide your clients with a beautiful, functional portal experience that matches your boba-inspired brand! 🧋✨
