'use client';

// 🚧 Hidden for MVP - Suggestions and feedback components
// import { ExpansionSuggestions } from '@/components/suggestions';
// import { UserFeedback } from '@/components/feedback';
import ServiceRequestForm from '@/components/forms/ServiceRequestForm/ServiceRequestForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  StaggerContainer,
  StaggerItem,
  FadeInView,
  MotionSection
} from '@/components/motion/MotionWrapper';

export default function HomePage() {

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 -left-64 w-96 h-96 bg-primary-400/10 dark:bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 -right-64 w-96 h-96 bg-accent-400/10 dark:bg-accent-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-primary-400/5 dark:bg-primary-600/5 rounded-full blur-3xl animate-pulse-slow"></div>

        {/* Hero section with form */}
        <section className="w-full px-4 py-20 md:py-28 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-100 dark:to-slate-800/30 pointer-events-none"></div>

          <StaggerContainer className="max-w-7xl mx-auto relative z-10">
            <StaggerItem className="text-center mb-12 md:mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight font-heading">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400">
                  Find English‑Speaking Service Providers, Anywhere
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed mb-4">
                QuickServiceMatch helps expats, travelers, and internationals find trusted English‑friendly providers—plumbers, cleaners, electricians, and more.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                <span>🚀</span>
                <span>Currently in early launch – expanding city by city</span>
              </p>
            </StaggerItem>

            <div className="flex flex-col lg:flex-row lg:gap-12 lg:items-start">
              {/* Left side: Form */}
              <StaggerItem className="w-full lg:w-7/12 mb-10 lg:mb-0">
                <ServiceRequestForm />
              </StaggerItem>

              {/* Right side: Platform explanation */}
              <StaggerItem className="w-full lg:w-5/12">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-500/50 shadow-sm hover:shadow-md transition-all duration-300 p-6 md:p-8 h-full">
                  <div className="mb-8 p-4 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 rounded-lg border border-green-100 dark:border-green-700/50 text-center transition-all duration-300 hover:shadow-sm">
                    <div className="space-y-3 text-left">
                      <div className="flex items-start gap-3">
                        <span className="text-green-600 dark:text-green-400 font-semibold">✅</span>
                        <span className="text-green-700 dark:text-green-300"><strong>Free to use</strong> – no fees, no hidden costs</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-green-600 dark:text-green-400 font-semibold">✅</span>
                        <span className="text-green-700 dark:text-green-300"><strong>English-speaking only</strong> – no language barriers</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-green-600 dark:text-green-400 font-semibold">✅</span>
                        <span className="text-green-700 dark:text-green-300"><strong>Reliable providers</strong> – selected based on real client feedback</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p className="leading-relaxed">
                      If you're a provider who speaks English, contact us to join. If you're a user, share this site with your friends to help us grow!
                    </p>
                  </div>
                </div>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </section>

        {/* 🚧 Hidden for MVP - Expansion suggestions section */}
        {/* <section className="w-full px-4 py-20 md:py-28 bg-gradient-to-b from-white/80 to-gray-50/80 dark:from-slate-800/50 dark:to-slate-900/50 backdrop-blur-sm relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>

          <FadeInView className="max-w-5xl mx-auto">
            <ExpansionSuggestions />
          </FadeInView>
        </section> */}

        {/* 🚧 Hidden for MVP - User feedback section */}
        {/* <MotionSection
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <UserFeedback />
        </MotionSection> */}
      </main>
      <Footer />
    </>
  );
}