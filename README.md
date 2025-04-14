
CoderSTAT
=========

CoderSTAT is a powerful and elegant coding journey tracker built with Next.js and Tailwind CSS.
It helps developers and students monitor their progress on various competitive programming platforms
like LeetCode GeeksforGeeks, codechef and codeforces,With 450 DSA sheet (A to Z DSA sheet of striver), Also You can track the coding events and contests in the event-tracker section.

"Helps you navigate and track your coding journey to success!"

Preview
-------
![image](https://github.com/user-attachments/assets/7ad86f38-17ee-4bfb-ac3e-f43c7e80df62)


Features
--------
- Profile Tracker: View total problems solved with easy, medium, hard, and fundamentals breakdown, ratings of the various platforms, you can share your profile also.
- Question Tracker: 450 questions of Strivers AtoZ DSA sheet.
- Event Tackekr: Track coding contests and setreminders with just one click.
- Responsive UI: Built with modern Tailwind CSS components.
- Authentication & Settings page included for a personalized experience.

Tech Stack
----------
- Frontend+backend: Next.js, React, Tailwind CSS
- Icons: Lucide Icons / Heroicons
- Authentication: Clerk 
- Styling: Tailwind CSS + Custom Components
- Data Integration: LeetCode, GeeksforGeeks, Codechef, Codeforces , CList API for events
  

Local Setup
-----------
1. Clone the repository
   git clone https://github.com/amanbind898/coderstat.git
   cd coderstat

2. Install dependencies
   npm install

3. Start the development server
   npm run dev

4. Visit http://localhost:3000


example of .env file: 

NEXT_PUBLIC_DRIZZLE_DB_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLIST_API=


Future Enhancements
-------------------
- More Sheets in question tracker like CP,OS,DBMS etc.
- Study planner



License
-------
This project is licensed under the MIT License. See the LICENSE file for details.

Built with ❤️ to help you ace your coding journey!
