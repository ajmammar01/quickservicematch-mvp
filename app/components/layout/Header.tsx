'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '../theme/ThemeToggle';

export default function Header() {
  // 🚧 Hidden for MVP - Mobile menu functionality
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const toggleMobileMenu = () => {
  //   setMobileMenuOpen(!mobileMenuOpen);
  // };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 shadow-sm dark:shadow-gray-800/30 border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400">
                QuickServiceMatch
              </span>
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
          </div>

          {/* 🚧 Hidden for MVP - Desktop navigation */}
          {/* <nav className="hidden md:ml-6 md:flex md:space-x-8">
            Navigation links would go here
          </nav> */}

          {/* Desktop controls */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
