'use client';

import Link from 'next/link';
import {
  StaggerContainer,
  StaggerItem,
  MotionParagraph
} from '@/components/motion/MotionWrapper';

export default function FooterClient() {
  return (
    <footer className="bg-gray-50/80 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-800/50 relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-400/10 dark:bg-primary-600/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-400/10 dark:bg-accent-600/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <StaggerContainer className="md:flex md:justify-between">
          <StaggerItem className="mb-8 md:mb-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400">
                QuickServiceMatch
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 max-w-xs">
              Connecting internationals with trusted English-speaking local professionals.
            </p>
          </StaggerItem>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <StaggerItem>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Contact Us</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="mailto:hq@quickservicematch.com"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 animated-underline"
                  >
                    hq@quickservicematch.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/31684768932"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 animated-underline"
                  >
                    WhatsApp: +31 6 8476 8932
                  </a>
                </li>
              </ul>
            </StaggerItem>

            <StaggerItem>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Cities</h3>
              <ul className="mt-4 space-y-3">
                {[
                  ['Amsterdam', '/cities/amsterdam'],
                  ['Rotterdam', '/cities/rotterdam'],
                  ['The Hague', '/cities/the-hague']
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 animated-underline"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </StaggerItem>

            {/* 🚧 Hidden for MVP - Company links */}
            {/* <StaggerItem>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-3">
                {[['About Us', '/about'], ['Contact', '/contact'], ['Careers', '/careers']].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 animated-underline"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </StaggerItem> */}

            <StaggerItem>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-3">
                {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms']].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 animated-underline"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </StaggerItem>
          </div>
        </StaggerContainer>

        <div className="mt-12">
          <div className="gradient-divider"></div>
          <div className="mt-8 text-center space-y-2">
            <MotionParagraph
              className="text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              © {new Date().getFullYear()} QuickServiceMatch. All rights reserved.
            </MotionParagraph>
            <MotionParagraph
              className="text-xs text-gray-400 dark:text-gray-500 italic"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              viewport={{ once: true }}
            >
              QuickServiceMatch is free and community‑driven. We're currently onboarding trusted providers city by city.
            </MotionParagraph>
          </div>
        </div>
      </div>
    </footer>
  );
}

