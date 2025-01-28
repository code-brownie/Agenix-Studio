# SaaS Website Builder, Project Management, and Dashboard with Stripe

### Features in this Application
- 🤯 **Multivendor B2B2B SaaS**
- 🏢 **Agency and Sub Accounts**
- 🌐 **Unlimited Funnel Hosting**
- 🚀 **Full Website & Funnel Builder**
- 💻 **Role-based Access**
- 🔄 **Stripe Subscription Plans**
- 🛒 **Stripe Add-on Products**
- 🔐 **Connect Stripe Accounts for All Users! - Stripe Connect**
- 💳 **Charge Application Fee Per Sale and Recurring Sales**
- 💰 **Custom Dashboards**
- 📊 **Media Storage**
- 📈 **Stripe Product Sync**
- 📌 **Custom Checkouts on Funnels**
- 📢 **Get Leads from Funnels**
- 🎨 **Kanban Board**
- 📂 **Project Management System**
- 🔗 **Notifications**
- 📆 **Funnel Performance Metrics**
- 🧾 **Agency and Subaccount Metrics**
- 🌙 **Graphs and Charts**
- ☀️ **Light & Dark Mode**
- 📄 **Functioning Landing Page**

---

## Project Configuration & Setup

### Prerequisites
Ensure the following are installed on your system:

- **Node.js** (v18 or higher) or **Bun** runtime
- **MySQL** database
- **Stripe** account (for Stripe Connect and payment features)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/code-brownie/Agenix-studio
```

### 2. Install Dependencies
Using **Bun** (preferred for this project):
```bash
bun install
```
Alternatively, using **npm**:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following configuration:

```env
# Application Environment
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_SECRET_KEY=

# Database Configuration
DATABASE_URL=
LOCAL_DATABASE_URL=
PROD_DATABASE_URL=
DB_USERNAME=
DB_PASSWORD=

# Stripe Connect Configuration
STRIPE_CLIENT_ID=
STRIPE_WEBHOOK_SECRET=
APPLICATION_FEE_PERCENTAGE=1
NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT=1
NEXT_PUBLIC_PLATFORM_ONETIME_FEE=2
NEXT_PUBLIC_PLATFORM_AGENY_PERCENT=1

# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Uploadthing Configuration
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Google API Keys
NEXT_PUBLIC_GOOGLE_API_KEY=
NEXT_PUBLIC_CUSTOM_SEARCH_ENGINE_ID=
NEXT_PUBLIC_YOUTUBE_API_KEY=
NEXT_PUBLIC_GEMINI_API_KEY=

# Builder API
NEXT_PUBLIC_BUILDER_API_KEY=

# Miscellaneous
STRIPE_PW=
```

### 4. Set Up the Database
Run the following Prisma commands to set up the database schema:
```bash
npx prisma migrate dev --name init
npx prisma generate
```
Alternatively, if using Bun:
```bash
bun prisma migrate dev --name init
bun prisma generate
```

### 5. Start the Development Server
Using **Bun**:
```bash
bun dev
```
Using **npm**:
```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).



---





