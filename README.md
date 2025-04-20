# CoderSTAT

**Track. Analyze. Ace your coding journey.**

---

## 🚀 Overview

**CoderSTAT** is a full-stack, developer-focused platform for tracking and visualizing your competitive programming progress across LeetCode, Codeforces, CodeChef, and GeeksforGeeks. Built for hackathons and beyond, CoderSTAT unifies your coding stats, DSA progress (Striver’s 450 Sheet), and contest calendar in a single, elegant dashboard.  
> *“Helps you navigate and track your coding journey to success!”*

---

## 📸 Preview
![image](https://github.com/user-attachments/assets/7ad86f38-17ee-4bfb-ac3e-f43c7e80df62)
*See your profile, stats, and upcoming contests at a glance.*

---

## ✨ Features

- **Unified Profile Tracker:** View your progress and ratings from LeetCode, Codeforces, CodeChef, and GeeksforGeeks in one place.
- **DSA Sheet Progress:** Track your journey through Striver’s 450 DSA Sheet. Mark questions as solved, in-progress, or bookmarked.
- **Event & Contest Tracker:** Stay updated about upcoming contests with reminders via CList API.
- **Leaderboard:** Compete with friends and see where you stand.
- **Public Profile Sharing:** Make your profile public and share your coding journey.
- **Responsive UI:** Built with Next.js and Tailwind CSS for a seamless experience.
- **Secure Authentication:** Clerk-powered authentication for privacy and data safety.
- **Admin Panel:** Upload new question sheets as an admin.

---

## 🛠️ Tech Stack

| Layer         | Technology                                              |
|---------------|--------------------------------------------------------|
| Frontend      | Next.js, React, Tailwind CSS, Lucide Icons, Heroicons  |
| Backend       | Next.js API Routes, Drizzle ORM                        |
| Database      | PostgreSQL (via Drizzle ORM)                           |
| Auth          | Clerk                                                  |
| APIs          | LeetCode, Codeforces, CodeChef, GeeksforGeeks, CList   |
| Testing       | Jest, React Testing Library, Supertest, Cypress, k6    |

---

## 🧑‍💻 Getting Started

### 1. **Clone the Repository**
git clone https://github.com/amanbind898/coderstat.git
cd coderstat

text

### 2. **Install Dependencies**
npm install

text

### 3. **Set Up Environment Variables**
Create a `.env` file in the root directory:
NEXT_PUBLIC_DRIZZLE_DB_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLIST_API=

text

### 4. **Run Locally**
npm run dev

text
Visit [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing

### Automated Testing

- **Backend:**  
  `npm run test:api` - Runs Jest & Supertest tests for API endpoints

- **Frontend:**  
  `npm run test:components` - Runs Jest & React Testing Library tests

- **End-to-End:**  
  `npm run test:e2e` - Runs Cypress tests for user journeys

- **Performance:**  
  `k6 run tests/load-test.js` - Runs k6 load tests

### User Acceptance

- **12 real users** tested all flows: sign up, profile setup, stats refresh, DSA tracking, contest reminders, and public profile sharing.
- **Result:** 100% success rate in core flows, with feedback incorporated for usability and reliability.

---

## 📝 Documentation


- **Testing Details:** See [`docs/Testing Approach for coderSTAT](https://github.com/amanbind898/coderstat/blob/master/docs/Testing%20Approach%20for%20CoderSTAT%20Platform.docx)


---

## 🏆 Why CoderSTAT?

- Solves the pain of fragmented coding stats and contest calendars.
- Empowers coders with actionable insights and a unified dashboard.
- Built, tested, and validated for real-world use and hackathon excellence.

---

## 📈 Roadmap

- Add more question sheets (CP, OS, DBMS, etc.)
- Integrate study planner
- Social features: friend lists, team leaderboards

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

**Built with ❤️ to help you ace your coding journey.**  
