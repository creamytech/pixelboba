# Builder.io Visual Editor Setup Guide

This guide will help you set up and use Builder.io to visually edit your marketing pages.

## 🎯 What's Included

Builder.io is now integrated into **marketing pages only**:

- ✅ Homepage
- ✅ Services
- ✅ Boba Club
- ✅ Process
- ✅ About
- ✅ Contact
- ✅ Work/Portfolio
- ✅ Any custom landing pages you create

**NOT included** (these stay untouched):

- ❌ Portal/Dashboard (`/portal/*`)
- ❌ Admin area (`/admin/*`)
- ❌ API routes (`/api/*`)

## 📋 Setup Steps

### Step 1: Create a Builder.io Account

1. Go to [https://builder.io](https://builder.io)
2. Sign up with your email (or use Google/GitHub login)
3. Create a new Space called "Pixel Boba" (or any name you prefer)

### Step 2: Get Your API Key

1. In Builder.io dashboard, click your space name in the top left
2. Go to **Account Settings** → **Space Settings**
3. Find your **Public API Key** (starts with a random string of characters)
4. Copy this key

### Step 3: Add API Key to Your Project

1. Open `.env.local` in your project root
2. Find the line: `NEXT_PUBLIC_BUILDER_API_KEY=YOUR_BUILDER_API_KEY_HERE`
3. Replace `YOUR_BUILDER_API_KEY_HERE` with your actual API key
4. Save the file

Example:

```bash
NEXT_PUBLIC_BUILDER_API_KEY=abc123def456ghi789
```

### Step 4: Configure Admin-Only Access

**IMPORTANT**: To prevent clients from editing, follow these steps:

1. In Builder.io dashboard, go to **Account Settings** → **Roles**
2. Click on **Editor** role
3. Change permissions to:
   - ✅ **Admin**: Full access
   - ❌ **Editor**: No access (or read-only)
   - ❌ **Developer**: No access (or read-only)
4. Save changes

5. Go to **Users** section
6. Make sure **only your email** has the **Admin** role
7. Do NOT invite clients or give them any access

### Step 5: Add Vercel Environment Variable

1. Go to your Vercel dashboard
2. Open your Pixel Boba project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Key**: `NEXT_PUBLIC_BUILDER_API_KEY`
   - **Value**: Your Builder.io API key
   - **Environment**: Production, Preview, Development (check all)
5. Click **Save**
6. Redeploy your site for changes to take effect

### Step 6: Restart Your Development Server

```bash
# Stop your dev server (Ctrl+C)
# Start it again
npm run dev
```

## 🎨 How to Use the Visual Editor

### Method 1: Edit Existing Pages (Recommended)

1. Go to [https://builder.io/content](https://builder.io/content)
2. Click **+ New** → **Page**
3. Enter the URL path you want to edit:
   - `/` for homepage
   - `/services` for services page
   - `/boba-club` for Boba Club page
   - etc.
4. Click **Create**
5. You'll see your live page with a toolbar on the left
6. Click any component to edit it
7. Drag new components from the left sidebar
8. Click **Publish** when done

### Method 2: Create New Landing Pages

1. Click **+ New** → **Page**
2. Enter a new URL like `/summer-promotion`
3. Start with a blank canvas or template
4. Drag Pomegranate components to build your page
5. Click **Publish**
6. Page will be live at `https://pixelboba.com/summer-promotion`

## 🧩 Available Components

All your Pomegranate components are available in the visual editor:

### Sections

- **Hero Section** - Main hero with headline and CTA
- **Services Preview** - Service cards
- **Process Section** - How we work steps
- **CTA Section** - Call-to-action with buttons
- **Social Proof** - Trust badges
- **Code First Section** - Benefits
- **Boba Club Promo** - Subscription promotion

### Boba Club

- **Boba Club Hero** - Boba Club hero section
- **Boba Club Pricing** - Pricing tiers
- **Boba Club Features** - Feature list

### Basic Elements

- **Pomegranate Image** - Images with bold borders and shadows
- **Pomegranate Heading** - Large bold headings
- **Pomegranate Button** - Buttons with your styling
- **Contact Form** - Contact form

### Plus Standard Elements

- Text blocks
- Images
- Videos
- Columns
- Spacers
- And more...

## 🎯 Common Tasks

### Change Homepage Hero Text

1. Go to Builder.io → Pages
2. Open `/` (homepage)
3. Click on the Hero Section component
4. Edit text in the right sidebar
5. Click **Publish**

### Add New Section to a Page

1. Open the page in Builder.io
2. Click where you want to add a section
3. Drag a component from the left sidebar
4. Configure it in the right sidebar
5. Click **Publish**

### Reorder Sections

1. Click on any section
2. Use the up/down arrows in the toolbar
3. Or drag the section by the handle
4. Click **Publish**

### Upload New Images

1. Drag a **Pomegranate Image** component onto the page
2. Click the upload button in the right sidebar
3. Select your image file
4. It will automatically have Pomegranate styling (borders/shadows)
5. Click **Publish**

## 🔒 Security Notes

**Access Control:**

- Only users with **Admin** role can edit content
- API key is public (safe to expose) but editing requires login
- Do NOT share your Builder.io login credentials
- Do NOT invite clients to your Builder.io space

**Protected Routes:**

- Portal/dashboard routes are completely separate
- Builder.io cannot access or modify `/portal/*` or `/admin/*`
- All authentication and database operations remain secure

## 🚨 Troubleshooting

### "Builder.io content not loading"

1. Check that `NEXT_PUBLIC_BUILDER_API_KEY` is set in `.env.local`
2. Restart your dev server: `npm run dev`
3. Clear your browser cache

### "Components not showing in editor"

1. Make sure you're viewing the correct Space in Builder.io
2. Check that the page model is set to "page"
3. Refresh the Builder.io editor

### "Changes not appearing on live site"

1. Make sure you clicked **Publish** (not just Save)
2. Wait 1-2 minutes for CDN cache to clear
3. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Check Vercel deployment logs

### "Seeing 404 errors"

1. Make sure the URL path in Builder.io matches exactly
2. URLs are case-sensitive: `/About` ≠ `/about`
3. Include leading slash: `/services` not `services`

## 📚 Resources

- [Builder.io Documentation](https://www.builder.io/c/docs/intro)
- [Builder.io Component Library](https://www.builder.io/c/docs/custom-components)
- [Builder.io Video Tutorials](https://www.youtube.com/@builderio)

## 🆘 Need Help?

If you run into issues:

1. Check this guide first
2. Look at Builder.io documentation
3. Check Vercel deployment logs
4. Reach out for support

---

**Note**: The visual editor is designed for marketing pages only. For portal/dashboard changes, continue editing the code directly as usual.
