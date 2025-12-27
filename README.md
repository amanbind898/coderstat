# 🚀 CoderSTAT

<div align="center">

![CoderSTAT Banner](public/logo.png)

**Track. Analyze. Ace your coding journey.**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle_ORM-blue)](https://orm.drizzle.team/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

*Your all-in-one platform for competitive programming excellence*

[Live Demo](https://coderstat.vercel.app) · [Report Bug](https://github.com/amanbind898/coderstat/issues) · [Request Feature](https://github.com/amanbind898/coderstat/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Integrations](#-api-integrations)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**CoderSTAT** is a comprehensive full-stack platform designed to help competitive programmers track, analyze, and improve their coding journey. It consolidates data from multiple coding platforms, provides detailed analytics, tracks DSA progress, and keeps you updated with upcoming contests—all in one beautifully designed dashboard.

### 🎭 Perfect For:
- Competitive programmers tracking multi-platform progress
- Students preparing for technical interviews
- Developers monitoring their DSA improvement
- Teams competing on leaderboards
- Anyone serious about systematic coding practice

---

## ✨ Key Features

### 🏆 **Multi-Platform Stats Tracker**
- **Real-time synchronization** with LeetCode (GraphQL), Codeforces (REST API), CodeChef (Web Scraping), and GeeksforGeeks (Web Scraping)
- Automatic stats refresh with server-side caching and timestamp tracking
- Difficulty-wise problem breakdown (Easy, Medium, Hard, Fundamental)
- Rating history, rank tracking (Global/Country), and contest participation statistics
- Visual analytics with pie charts and progress indicators using Recharts
- Upsert mechanism for efficient database updates

### 📚 **Question Tracker & DSA Sheet**
- Track progress through Striver's 450 DSA Sheet and custom problem sets
- Mark questions as: **Not Started**, **In Progress**, **Solved**, or **Bookmarked**
- Advanced filtering by difficulty, topic, status, and source platform
- Direct links to problems on various platforms
- Personal notes, solution code storage, and confidence ratings (0-5 scale)
- Time tracking per problem (in minutes)
- Progress statistics with visual indicators and completion percentages
- Bulk import functionality for admin users

### 📅 **Contest Calendar & Event Tracker**
- Live contest updates from **7+ platforms** via CList API v4
- **IST timezone conversion** from UTC for all contest times
- Filter contests by platform: Codeforces, CodeChef, LeetCode, AtCoder, GeeksforGeeks, Naukri Code360, TopCoder
- **Interactive calendar view** using React Big Calendar with event cards
- **Google Calendar export** - Add contests directly to your calendar
- **Local storage caching** for offline access with daily refresh
- **Today vs All Upcoming** filter for quick contest discovery
- "Starting Soon" badges for contests within 12 hours

### 👤 **User Profile & Settings**
- Customizable profile with bio (500 char limit), location, institute, date of birth, and profile picture URL
- Social media links integration: GitHub, LinkedIn, Twitter, Instagram, Portfolio
- Coding platform username management (LeetCode, Codeforces, CodeChef, GeeksforGeeks)
- **Public/Private profile visibility toggle** with real-time updates
- **Embeddable profile widget** at `/embed/[userId]` for sharing on personal websites
- **Shareable profile links** at `/profile/[userId]`
- Collapsible settings sections for better UX
- Real-time profile updates with toast notifications

### 🎯 **Leaderboard & Competition**
- Global and friend leaderboards with aggregated stats
- Compare progress with peers across platforms
- Platform-wise rankings and total problems solved tracking
- Sortable by total solved, rating, or platform-specific metrics

### 🔐 **Secure Authentication**
- **Clerk-powered authentication** with OAuth (Google, GitHub) and email/password
- **Protected routes with middleware** - automatic redirects to sign-in
- **Role-based access control** - admin features require `org:admin` role
- Session management with secure token handling
- Return URL preservation for seamless navigation

### 🎨 **Modern UI/UX**
- **Fully responsive design** - optimized for mobile, tablet, and desktop
- **Dark/Light theme support** with next-themes
- Gradient backgrounds and premium aesthetic design
- Smooth animations and transitions with tw-animate-css
- **Loading skeletons** for better perceived performance
- **Toast notifications** (React Toastify) for real-time user feedback
- **Accessible components** with proper ARIA labels and keyboard navigation
- shadcn/ui components with Radix UI primitives

### 👨‍💼 **Admin Features**
- Upload new question sheets via `/upload` route (requires `org:admin` role)
- Bulk import DSA questions with CSV/JSON support
- Manage master questions database
- Platform content management and question categorization

---

## 📸 Screenshots

<div align="center">

### Dashboard Overview
![Dashboard](https://github.com/user-attachments/assets/7ad86f38-17ee-4bfb-ac3e-f43c7e80df62)

</div>

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js 15.2.4 (App Router)
- **UI Library:** React 19.0.0
- **Styling:** Tailwind CSS 4.0
- **Icons:** Lucide React 0.487.0, React Icons 5.5.0
- **Components:** Radix UI (@radix-ui/react-slot, @radix-ui/react-switch), shadcn/ui
- **Animations:** tw-animate-css 1.2.5
- **Charts:** Recharts 2.15.2
- **Calendar:** React Big Calendar 1.18.0
- **State Management:** React Hooks
- **Toast Notifications:** React Toastify 11.0.5
- **Loading States:** React Loading Skeleton 3.5.0
- **Utilities:** clsx 2.1.1, tailwind-merge 3.1.0, class-variance-authority 0.7.1

### **Backend**
- **API Routes:** Next.js API Routes (Serverless)
- **ORM:** Drizzle ORM 0.41.0
- **Database:** PostgreSQL (Neon Serverless @neondatabase/serverless 1.0.0)
- **Authentication:** Clerk 6.15.0 (OAuth, Session Management, Role-based Access)
- **HTTP Client:** Axios 1.8.4
- **Web Scraping:** Cheerio 1.0.0
- **Theme Management:** next-themes 0.4.6
- **Secondary Auth:** NextAuth 4.24.11 (for platform integrations)

### **Development Tools**
- **Package Manager:** npm
- **Version Control:** Git
- **Database Management:** Drizzle Kit 0.30.6
- **Runtime:** Node.js
- **TypeScript Support:** @types/node 22.14.1, @types/supertest 6.0.3
- **Environment Variables:** dotenv 16.4.7
- **Build Tool:** tsx 4.19.3

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (or use Neon)
- **Git**

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/amanbind898/coderstat.git
   cd coderstat
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   
   Create a `.env.local` file in the root directory and add:
   ```env
   # Database
   NEXT_PUBLIC_DRIZZLE_DB_URL=postgresql://user:password@host/database
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
   CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   
   # CList API for Contest Data
   NEXT_PUBLIC_CLIST_API=https://clist.by/api/v4/contest/?username=xxxxx&api_key=xxxxx&limit=100&start__gt=2025-01-01T00:00:00&order_by=start
   ```

4. **Set Up Database**
   ```bash
   # Generate database schema
   npx drizzle-kit generate
   
   # Push schema to database
   npx drizzle-kit push
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Open Your Browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
coderstat/
├── public/                    # Static assets
│   ├── logo.png              # Main logo
│   ├── mascot.png            # Mascot image
│   ├── mascot-head.png       # Mascot head icon
│   ├── leetcode.png          # LeetCode logo
│   ├── codeforces.jpg        # Codeforces logo
│   ├── codechef.jpg          # CodeChef logo
│   ├── gfg.png              # GeeksforGeeks logo
│   └── [other platform logos]
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Clerk webhook endpoints
│   │   │   ├── leaderboard/   # Leaderboard data
│   │   │   ├── profile/       # User profile CRUD
│   │   │   ├── public-profile/# Public profile data
│   │   │   ├── questions/     # Question tracker API
│   │   │   │   └── import/    # Bulk question import
│   │   │   ├── stats/         # Platform stats fetcher
│   │   │   ├── toggle-profile-visibility/  # Profile privacy
│   │   │   └── updatePlatformStats/  # Stats refresh
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── UserProfile.js
│   │   │   ├── PlatformCards.js
│   │   │   ├── DsaStatsCard.js
│   │   │   ├── CPStatsCard.js
│   │   │   ├── TotalProblemsSolved.js
│   │   │   ├── ContestCalendar.js
│   │   │   ├── Leaderboard.js
│   │   │   ├── Hero1.js       # Landing page hero sections
│   │   │   ├── Hero2.js
│   │   │   ├── Hero3.js
│   │   │   └── Loader.js
│   │   ├── event-tracker/     # Contest calendar page
│   │   │   └── page.js
│   │   ├── profile/           # Public profile pages
│   │   │   └── [userId]/
│   │   ├── profile-tracker/   # User dashboard
│   │   │   └── page.js
│   │   ├── question-tracker/  # DSA sheet tracker
│   │   │   └── page.js
│   │   ├── settings/          # User settings
│   │   │   └── page.js
│   │   ├── upload/            # Admin upload page
│   │   │   └── page.js
│   │   ├── embed/             # Embeddable widgets
│   │   │   └── [userId]/
│   │   ├── unauthorized/      # Access denied page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.js          # Root layout with Clerk
│   │   └── page.js            # Landing page
│   ├── components/            # shadcn/ui components
│   │   └── ui/                # Reusable UI primitives
│   │       ├── alert.jsx
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── skeleton.jsx
│   │       └── switch.jsx
│   ├── db/                    # Database configuration
│   │   ├── schema.js          # Drizzle schema (4 tables)
│   │   └── index.js           # Neon DB connection
│   ├── lib/                   # Utility functions
│   │   ├── platformAPI.js     # API fetchers for coding platforms
│   │   ├── questionTrackerApi.js  # Question CRUD operations
│   │   ├── utils.js           # Helper utilities
│   │   └── auth/              # Auth utilities
│   └── middleware.js          # Clerk auth middleware
├── docs/                      # Documentation
│   └── Testing Approach for CoderSTAT Platform.docx
├── drizzle/                   # Drizzle migrations
│   └── meta/                  # Migration metadata
├── .env.local                 # Environment variables (gitignored)
├── drizzle.config.js          # Drizzle ORM configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── next.config.mjs            # Next.js configuration
├── components.json            # shadcn/ui config
├── jsconfig.json              # JavaScript path aliases
├── postcss.config.mjs         # PostCSS configuration
└── package.json               # Dependencies
```

---

## 🔌 API Integrations

### **Supported Platforms**

| Platform | Integration Method | Features | Data Points |
|----------|-------------------|----------|-------------|
| **LeetCode** | GraphQL API | Problems solved, Contest stats | Easy/Medium/Hard counts, Rating, Global Rank, Attended Contests |
| **Codeforces** | REST API | User info, Submissions | Current/Max Rating, Problems Solved, Contest Participation |
| **CodeChef** | Web Scraping (Cheerio) | Profile stats, Rankings | Current/Highest Rating, Global/Country Rank, Problems Solved, Contest Count |
| **GeeksforGeeks** | Web Scraping (Cheerio) | Profile stats, Problem breakdown | Total Solved, Easy/Medium/Hard, Fundamental, Coding Score, Institute Rank |
| **CList** | REST API | Contest Calendar | Upcoming contests across 7+ platforms with IST conversion |

### **Implementation Details**

#### **LeetCode Integration**
- GraphQL endpoint: `https://leetcode.com/graphql`
- Query: `userProfilePublicProfile` + `userContestRanking`
- Data: Submission stats by difficulty, contest rating, global ranking
- Error handling: Graceful fallback for missing contest data

#### **Codeforces Integration**
- API endpoints:
  - `/api/user.info` - User profile and rating
  - `/api/user.status` - Submission history
- Logic: Filters submissions by `verdict: "OK"` to count unique problems solved
- Data: Current rating, max rating, total problems solved

#### **CodeChef Integration**
- URL: `https://www.codechef.com/users/{username}`
- Scraping: Cheerio selectors for rating cards, ranks, problem counts
- Extracts: Current/highest rating, global/country rank, contest count

#### **GeeksforGeeks Integration**
- URL: `https://auth.geeksforgeeks.org/user/{username}`
- Scraping: CSS class-based selectors
- Parses: Problem counts by difficulty (School, Basic, Easy, Medium, Hard)
- Calculates: Fundamental count (School + Basic)

#### **Contest Calendar (CList API)**
- Endpoint: CList API v4 with authentication
- Features: Platform filtering, IST timezone conversion, Google Calendar export
- Caching: Local storage with daily refresh
- Platforms: Codeforces, CodeChef, LeetCode, AtCoder, GeeksforGeeks, Naukri Code360, TopCoder

### **API Endpoints**

#### **Profile Management**
- `POST /api/profile` - Fetch or create user profile
- `GET /api/public-profile/[userId]` - Public profile data
- `POST /api/toggle-profile-visibility` - Toggle public/private status

#### **Platform Stats**
- `POST /api/stats` - Get all platform stats for user
- `POST /api/updatePlatformStats` - Refresh stats from all platforms
  - Parameters: `clerkId`, `leetCode`, `geeksforgeeks`, `codeforces`, `codechef`
  - Returns: Updated stats with timestamps
  - Implements: Upsert logic (update existing or insert new)

#### **Question Tracker**
- `GET /api/questions` - Fetch user's question progress
- `POST /api/questions` - Update question status
- `POST /api/questions/import` - Bulk import DSA questions (admin only)

#### **Leaderboard**
- `GET /api/leaderboard` - Fetch global/friend rankings
  - Aggregates: Total problems solved across platforms
  - Sorting: By total solved, rating, or platform-specific metrics

---

## � Authentication & Middleware

### **Clerk Authentication**
CoderSTAT uses [Clerk](https://clerk.com) for comprehensive authentication and user management:

- **OAuth Integration:** Sign up/Sign in with Google, GitHub, or email
- **Session Management:** Secure session handling with automatic token refresh
- **User Management:** Profile data, email verification, password management
- **Protected Routes:** Middleware-based route protection

### **Middleware Implementation**

The `middleware.js` file implements route protection and role-based access control:

```javascript
// Protected routes requiring authentication
- /profile-tracker     # User dashboard
- /question-tracker    # DSA progress tracker
- /event-tracker       # Contest calendar
- /settings            # User settings
- /upload              # Admin-only question upload
```

**Key Features:**
- Automatic redirect to `/sign-in` for unauthenticated users
- Return URL preservation for seamless post-login navigation
- Role-based access control for admin features
- Checks `publicMetadata.role` for `org:admin` role

### **Role-Based Access**

**Admin Role (`org:admin`):**
- Access to `/upload` route for bulk question imports
- Manage master questions database
- Platform content management

**Regular Users:**
- Access to all tracker features
- Profile customization
- Public/private profile toggle

### **Profile Privacy**

Users can control their profile visibility:
- **Public:** Profile accessible at `/profile/[userId]`, embeddable widgets enabled
- **Private:** Profile only visible to the user, sharing disabled
- Toggle via Settings or Profile Tracker dashboard

---

## �🗃️ Database Schema

### **Tables**

#### **ProfileData**
Stores user profile information
```sql
- id (serial, primary key)
- clerkId (varchar, unique)
- name (varchar)
- primaryEmail (varchar)
- dateOfBirth (date)
- location (varchar)
- bio (varchar, max 500 chars)
- institute (varchar)
- profilePic (varchar, URL)
- Social links: instagram, linkedin, twitter, github, portfolio
- Platform usernames: leetCode, codeforces, codechef, geeksforgeeks
- isPublic (boolean, default true)
- createdAt (timestamp)
```

#### **CodingPlatformStats**
Stores synchronized stats from coding platforms
```sql
- id (serial, primary key)
- clerkId (varchar, foreign key)
- platform (varchar)
- solvedCount (varchar)
- rating (varchar)
- highestRating (varchar)
- globalRank (varchar)
- countryRank (varchar)
- easyCount, mediumCount, hardCount (varchar)
- fundamentalCount (varchar)
- totalcontest (varchar)
- lastUpdated (timestamp)
```

#### **MasterQuestions**
Master list of DSA/CP questions
```sql
- id (serial, primary key)
- topic (varchar)
- problem (varchar)
- url (varchar)
- difficulty (varchar: easy/medium/hard)
- source (varchar: platform name)
- sourceId (varchar)
- tags (json array)
- addedAt (timestamp)
```

#### **UserQuestionProgress**
Tracks individual user's question progress
```sql
- id (serial, primary key)
- clerkId (varchar)
- questionId (integer, foreign key)
- status (varchar: not_started/in_progress/solved/bookmarked)
- timesAttempted (integer)
- lastAttemptDate (timestamp)
- solvedDate (timestamp)
- timeSpent (integer, minutes)
- solution (text)
- language (varchar)
- notes (text)
- confidence (integer, 0-5)
- updatedAt (timestamp)
```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_DRIZZLE_DB_URL` | PostgreSQL connection string | ✅ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | ✅ |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign in route | ✅ |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign up route | ✅ |
| `NEXT_PUBLIC_CLIST_API` | CList API endpoint with credentials | ✅ |

### **Getting API Keys**

1. **Clerk Authentication**
   - Sign up at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy API keys from dashboard

2. **CList API**
   - Register at [clist.by](https://clist.by)
   - Generate API key from settings
   - Format: `https://clist.by/api/v4/contest/?username=YOUR_USERNAME&api_key=YOUR_KEY&limit=100&start__gt=2025-01-01T00:00:00&order_by=start`

3. **Database (Neon)**
   - Sign up at [neon.tech](https://neon.tech)
   - Create a PostgreSQL database
   - Copy connection string

---



<div align="center">

**⭐ Star this repository if you find it helpful!**

**Built with ❤️ to help you ace your coding journey**

[⬆ Back to Top](#-coderstat)

</div>  
