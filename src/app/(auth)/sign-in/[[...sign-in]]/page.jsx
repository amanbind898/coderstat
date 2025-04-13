import { SignUp } from '@clerk/nextjs'
import { Shield, Mail } from 'lucide-react'


export default function Page() {
  return (
    <section className=" border-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Left Panel (hidden on small screens) */}
        <section className="relative hidden lg:flex items-center bg-[var(--graph-blue)] lg:col-span-5 xl:col-span-6">
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
              Join CoderSTAT Community
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-white/90">
              Track, analyze, and share your coding progress with CoderSTAT — the platform
              that helps you navigate your journey to success.
            </p>

            <div className="mt-12">
              <div className="rounded-lg bg-zinc-950 p-6">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
                  <Mail className="h-6 w-6" />
                  Registration Benefits
                </h3>
                <ul className="mt-4 space-y-3 text-white/90">
                  <li>• Track your progress across coding platforms</li>
                  <li>• Analyze your performance and identify improvement areas</li>
                  <li>• Join a community of like-minded developers</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel */}
        <main className="flex items-center justify-center px-6 py-12 sm:px-8 lg:col-span-7 xl:col-span-6">
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
