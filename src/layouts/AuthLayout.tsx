import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Cloud } from 'lucide-react';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="px-6 py-4">
        <Link to="/" className="inline-flex items-center gap-2 text-white">
          <Cloud className="w-7 h-7 text-sky-400" />
          <span className="font-semibold">Cloud Service Model Advisor</span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-4">
        {children}
      </div>
      <footer className="px-6 py-4 text-center text-slate-500 text-xs">
        Academic Decision-Support Framework — IBM Internship Project
      </footer>
    </div>
  );
}
