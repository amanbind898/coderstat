import { SignUp } from '@clerk/nextjs'
import { Shield, Mail, Code, ChartBar, Calendar } from 'lucide-react'

export default function Page() {
  return (
    <section className="border-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-10">
        {/* Left Panel (60% on large screens) */}
        <section className="relative hidden lg:flex items-center bg-[var(--graph-blue)] lg:col-span-6">
          <div className="absolute inset-0 bg-gradient-to-t from-white to-gray-900 opacity-80" />
          <div className="relative w-full p-12">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 rounded-lg bg-white/10 p-3">
                <img src="/mascot.png" alt="CoderSTAT Mascot" className="h-12 w-12" />
                <div>
                  <span className="text-lg font-bold text-white">CoderSTAT</span>
                  <span className="text-sm text-white/90">Track your coding journey</span>
                </div>
              </div>
            </div>

            <h2 className="mt-12 text-4xl font-bold text-white md:text-5xl">
              Level Up Your Coding Journey
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-white/90">
              Join CoderSTAT to track your progress, analyze your performance, and connect with 
              a community of dedicated developers.
            </p>

            <div className="mt-10 space-y-6">
              <div className="rounded-lg bg-zinc-950 p-6">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
                  <ChartBar className="h-6 w-6" />
                  Profile Tracker
                </h3>
                <p className="mt-2 text-white/90">
                  View total problems solved with easy, medium, hard, and fundamentals breakdown. 
                  Track your ratings across various platforms and share your profile with others.
                </p>
              </div>
              
              <div className="rounded-lg bg-zinc-950 p-6">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
                  <Code className="h-6 w-6" />
                  Question Tracker
                </h3>
                <p className="mt-2 text-white/90">
                  Track your progress through 450 questions of Strivers AtoZ DSA sheet. 
                  Stay organized and consistent in your DSA preparation.
                </p>
              </div>
              
              <div className="rounded-lg bg-zinc-950 p-6">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
                  <Calendar className="h-6 w-6" />
                  Event Tracker
                </h3>
                <p className="mt-2 text-white/90">
                  Never miss a coding contest again. Track upcoming events and set reminders 
                  with just one click.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel (40% on large screens) */}
        <main className="flex items-center justify-center px-6 py-12 sm:px-8 lg:col-span-4">
          <div className="w-full max-w-xl space-y-6">
            {/* Mobile Header */}
            <div className="lg:hidden">
              <div className="inline-flex items-center gap-3 rounded-xl bg-white p-4 shadow-md">
                <img src="/mascot.png" alt="CoderSTAT Mascot" className="h-10 w-10" />
                <div>
                  <span className="text-xl font-bold text-[var(--logo-blue)]">CoderSTAT</span>
                  <span className="block text-sm text-gray-600">Track your coding journey</span>
                </div>
              </div>
              <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
                Create Your Account 💻
              </h1>
              <p className="mt-2 text-gray-500">
                Join the CoderSTAT community to level up your coding skills
              </p>
            </div>

            {/* SignUp Form */}
            <SignUp
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'rounded-xl shadow-md',
                  headerTitle: 'text-2xl font-bold text-gray-900',
                  headerSubtitle: 'text-gray-600',
                  formButtonPrimary: 'bg-[var(--graph-blue)] hover:bg-[var(--logo-blue)]',
                },
              }}
              redirectUrl="/settings"
            />

            <p className="text-center text-sm text-gray-500">
              By signing up, you agree to CoderSTAT's terms of service and privacy policy.
            </p>
          </div>
        </main>
      </div>
    </section>
  )
}