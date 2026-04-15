'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => 
    pathname === path 
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
      : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with Gradient */}
          <Link href="/" className="flex items-center group gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white text-xl font-black">₱</span>
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
              Budget<span className="text-indigo-500">Tracker</span>
            </span>
          </Link>

          {/* Navigation Links (Simplified to Single Page) */}
          <div className="flex items-center gap-1">
            <Link 
              href="/dashboard" 
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${isActive('/dashboard')}`}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}