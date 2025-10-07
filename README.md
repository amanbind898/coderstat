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
- **Real-time synchronization** with LeetCode, Codeforces, CodeChef, and GeeksforGeeks
- Automatic stats refresh with caching
- Difficulty-wise problem breakdown (Easy, Medium, Hard)
- Rating history and rank tracking
- Contest participation statistics

### 📚 **Question Tracker & DSA Sheet**
- Track progress through Striver's 450 DSA Sheet and custom problem sets
- Mark questions as: Not Started, In Progress, Solved, or Bookmarked
- Filter by difficulty, topic, status, and source
- Direct links to problems on various platforms
- Personal notes and solution tracking
- Progress statistics with visual indicators

### 📅 **Contest Calendar & Event Tracker**
- Live contest updates from 7+ platforms via CList API
- IST timezone conversion
- Filter contests by platform (Codeforces, CodeChef, LeetCode, AtCoder, etc.)
- Calendar view with event details
- Local storage caching for offline access
- Today's contests quick filter

### 👤 **User Profile & Settings**
- Customizable profile with bio, location, institute, and profile picture
- Social media links integration (GitHub, LinkedIn, Twitter, Instagram, Portfolio)
- Coding platform username management
- Public/Private profile visibility toggle
- Embeddable profile widget for sharing
- Real-time profile updates

### 🎯 **Leaderboard & Competition**
- Global and friend leaderboards
- Compare progress with peers
- Platform-wise rankings
- Total problems solved tracking

### 🔐 **Secure Authentication**
- Clerk-powered authentication system
- OAuth integration
- Protected routes with middleware
- Session management

### 🎨 **Modern UI/UX**
- Fully responsive design (mobile, tablet, desktop)
- Dark/Light theme support
- Smooth animations and transitions
- Loading skeletons and states
- Toast notifications for user feedback
- Accessible components

### 👨‍💼 **Admin Features**
- Upload new question sheets
- Manage master questions database
- Platform content management

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
- **Icons:** Lucide React, React Icons
- **Components:** Radix UI, shadcn/ui
- **Animations:** tw-animate-css
- **Charts:** Recharts
- **Calendar:** React Big Calendar
- **State Management:** React Hooks
- **Toast Notifications:** React Toastify
- **Loading States:** React Loading Skeleton

### **Backend**
- **API Routes:** Next.js API Routes
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL (Neon serverless)
- **Authentication:** Clerk
- **HTTP Client:** Axios
- **Web Scraping:** Cheerio

### **Development Tools**
- **Package Manager:** npm
- **Version Control:** Git
- **Database Management:** Drizzle Kit
- **Runtime:** Node.js
- **TypeScript Support:** @types/node

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
│   ├── logo.png
│   ├── mascot.png
│   └── [platform logos]       # LeetCode, Codeforces, CodeChef, etc.
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── api/               # API routes
│   │   │   ├── leaderboard/
│   │   │   ├── profile/
│   │   │   ├── questions/
│   │   │   ├── stats/
│   │   │   └── updatePlatformStats/
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── UserProfile.js
│   │   │   ├── PlatformCards.js
│   │   │   ├── ContestCalendar.js
│   │   │   ├── Leaderboard.js
│   │   │   └── Loader.js
│   │   ├── event-tracker/     # Contest calendar page
│   │   ├── profile/           # Public profile pages
│   │   ├── profile-tracker/   # User dashboard
│   │   ├── question-tracker/  # DSA sheet tracker
│   │   ├── settings/          # User settings
│   │   ├── upload/            # Admin upload page
│   │   ├── embed/             # Embeddable widgets
│   │   ├── layout.js          # Root layout
│   │   └── page.js            # Landing page
│   ├── db/                    # Database configuration
│   │   ├── schema.js          # Database schema
│   │   └── index.js           # Database connection
│   ├── lib/                   # Utility functions
│   │   └── questionTrackerApi.js
│   ├── middleware.js          # Auth middleware
│   └── components/            # UI components
│       └── ui/                # shadcn/ui components
├── docs/                      # Documentation
│   └── Testing Approach for CoderSTAT Platform.docx
├── drizzle/                   # Drizzle migrations
├── drizzle.config.js          # Drizzle configuration
├── tailwind.config.js         # Tailwind configuration
├── next.config.mjs            # Next.js configuration
├── components.json            # shadcn/ui config
└── package.json               # Dependencies
```

---

## 🔌 API Integrations

### **Supported Platforms**

| Platform | Features | Data Points |
|----------|----------|-------------|
| **LeetCode** | Problems solved, difficulty breakdown | Easy, Medium, Hard counts, Rating |
| **Codeforces** | Contest rating, ranks | Current Rating, Max Rating, Global/Country Rank |
| **CodeChef** | Problems solved, rating | Star rating, Highest rating |
| **GeeksforGeeks** | Solved problems count | Total solved, Profile data |
| **CList** | Contest calendar | Upcoming contests across platforms |

### **API Endpoints**

- `POST /api/updatePlatformStats` - Refresh platform statistics
- `GET /api/profile/[userId]` - Fetch user profile data
- `GET /api/stats/[clerkId]` - Get coding statistics
- `GET /api/leaderboard` - Fetch leaderboard data
- `GET /api/questions` - Get question tracker data
- `POST /api/questions` - Update question status
- `GET /api/public-profile/[userId]` - Public profile data
- `POST /api/toggle-profile-visibility` - Toggle profile visibility

---

## 🗃️ Database Schema

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

## 🧪 Testing

### **Testing Approach**

The project follows a comprehensive testing strategy documented in `docs/Testing Approach for CoderSTAT Platform.docx`.

### **Test Coverage**

- ✅ **Unit Tests** - Component and utility functions
- ✅ **Integration Tests** - API routes and database operations
- ✅ **End-to-End Tests** - User flows and journeys
- ✅ **Performance Tests** - Load testing with k6
- ✅ **User Acceptance Testing** - 12 real users, 100% success rate

### **Available Test Commands**

```bash
# Run all tests
npm test

# Backend API tests
npm run test:api

# Frontend component tests
npm run test:components

# End-to-end tests
npm run test:e2e

# Performance/Load tests
k6 run tests/load-test.js
```

### **Test Results**

- **12 real users** tested core flows
- **100% success rate** on primary features
- Flows tested: sign up, profile setup, stats refresh, DSA tracking, contest viewing, profile sharing

---

## 🌐 Deployment

### **Vercel (Recommended)**

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### **Other Platforms**

Compatible with:
- Netlify
- Railway
- Render
- AWS Amplify

### **Database Setup**

For production, use:
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)
- Any PostgreSQL provider

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### **Contribution Guidelines**

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure all tests pass

---

## 🎯 Roadmap

### **Upcoming Features**

- [ ] Additional question sheets (OS, DBMS, System Design)
- [ ] Study planner with scheduling
- [ ] Friend system and team leaderboards
- [ ] Progress charts and analytics
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Email/Push notifications for contests
- [ ] AI-powered question recommendations
- [ ] Code snippet storage
- [ ] Discussion forum

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **CList API** for contest data
- **Clerk** for authentication
- **Neon** for database hosting
- **Vercel** for deployment
- **shadcn/ui** for UI components
- All coding platforms for public APIs

---

## 👨‍💻 Author

**Aman Bind**

- GitHub: [@amanbind898](https://github.com/amanbind898)
- Project: [CoderSTAT](https://github.com/amanbind898/coderstat)

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/amanbind898/coderstat/issues)
- **Discussions:** [GitHub Discussions](https://github.com/amanbind898/coderstat/discussions)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

**Built with ❤️ to help you ace your coding journey**

[⬆ Back to Top](#-coderstat)

</div>  
