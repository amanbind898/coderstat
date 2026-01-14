# CoderSTAT: Interview Preparation Guide

This resource is designed to help you confidently explain the technical depth of **CoderSTAT** during interviews.

---

## 🛠 Project Core Architecture
*   **Framework:** Next.js 15 (App Router), React 19, Tailwind CSS.
*   **Backend:** Next.js API Routes (Serverless).
*   **Database:** PostgreSQL (Neon Serverless) with Drizzle ORM.
*   **Auth:** Clerk (OAuth + Middleware).

---

## 🔍 1. How Web Scraping Works in CoderSTAT?
In this project, we use **Cheerio** for platforms that don't provide public APIs (CodeChef, GFG).

*   **Mechanism:** When a user requests a stat refresh, the server makes an HTTP fetch to the platform's public profile page.
*   **Parsing:** Cheerio loads the HTML content and uses CSS selectors (`.scoreCard_head`, `.rating-number`) to extract raw text.
*   **Formatting:** We use Regex to clean strings (e.g., removing "?" or "Highest Rating" text) and convert them into structured JSON.
*   **Why Cheerio?** Since we run on Next.js serverless functions, we need a lightweight, fast parsing library rather than a heavy headless browser like Puppeteer.

---

## 🚦 2. Handling Rate Limiting & Blocking
Scraping and frequent API calls can lead to 429 (Too Many Requests) or IP bans.

*   **Caching:** We don't fetch data on every page load. Stats are cached in PostgreSQL. We only allow a refresh if the `lastUpdated` timestamp is beyond a certain threshold (e.g., 6 hours).
*   **User-Triggered Refresh:** Stats are updated only when the user explicitly clicks "Refresh", preventing automated spamming.
*   **Client-Side Caching:** For the Contest Calendar, we use `localStorage` to cache results so the user doesn't hit the CList API repeatedly during a single session.

---

## 🔄 3. Data Consistency (The "Single Source of Truth")
How do we ensure the dashboard reflects the real platform data accurately?

*   **Upsert Logic:** When stats are fetched, we use an **Upsert** (Update or Insert) pattern. We check if a record for that `clerkId` and `platform` exists. If yes, we update; if no, we insert.
*   **Data Normalization:** Different platforms use different difficulty labels (e.g., LeetCode has "Easy", GFG has "Basic/School"). We map these to a consistent schema in our DB so the global charts look uniform.
*   **Transactional Integrity:** Using Drizzle ORM ensures that if a fetch for one platform fails during a bulk update, we can handle it gracefully without corrupting existing data for other platforms.

---

## 🛡️ 4. Handling API Failures & Breakages
External APIs and Scraping are notoriously fragile.

*   **Graceful Degradation:** If the LeetCode API is down, the dashboard still renders. We show the **cached data** from our DB and display a Toast notification: *"Failed to fetch LeetCode, showing last updated data from [Timestamp]"*.
*   **Scraper Fragility:** Platforms often change their CSS classes. I decoupled the fetching logic (`platformAPI.js`) from the UI. If a class changes, I only need to update the selector in one file.
*   **Robust Fetching:** We use `try-catch` blocks for every external request. We return an `error` field in the response object instead of letting the whole API route crash.

---

## 🗄️ 5. Why PostgreSQL (SQL) over MongoDB (NoSQL)?
This is a common interview question.

1.  **Strict Schema:** High-quality CP data (ratings, counts) is structured. SQL ensures we don't end up with "undefined" values in our charts.
2.  **Relational Data:** We have clear relations: `User` -> `PlatformStats`, `User` -> `QuestionProgress`, `QuestionProgress` -> `MasterQuestions`. SQL handles these joins much more efficiently than NoSQL.
3.  **Drizzle ORM:** Provides type safety (TypeScript) which reduces runtime bugs when handling complex user stats.
4.  **Scaling:** Since we use Neon (Serverless Postgres), the DB scales to zero when not in use, making it cost-effective for a personal project while maintaining ACID compliance.

---

## 🚀 6. Biggest Technical Challenges & Solutions

### A. The "Hydration" Challenge
*   **Problem:** Dates and User Greetings (Good Morning/Evening) were causing "Hydration Mismatch" errors because the server time and client time differed.
*   **Solution:** I created a separate `UserGreeting` component and wrapped logic in `useEffect` to ensure dynamic text only renders on the client side after the initial mount.

### B. Scraping GFG/CodeChef
*   **Problem:** GFG occasionally uses dynamic class names or updates their UI, breaking selectors.
*   **Solution:** Implemented robust Regex patterns that look for numerical values inside specific parent containers rather than relying on highly specific, deep CSS selectors.

### C. Contest Timezones
*   **Problem:** CList provides dates in UTC. Users in India were getting confused.
*   **Solution:** Wrote a utility function to convert all incoming UTC strings to IST (UTC+5:30) before rendering them in the `ContestCalendar`.

---

## 💡 Pro-Tip for the Interview
When asked about what you'd add next, mention **"Real-time Signal Analysis"** or **"Machine Learning based problem recommendations"**. It shows you're thinking about the product's future, not just the code.
