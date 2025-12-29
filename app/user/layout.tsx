'use client';

import Link from 'next/link';
import { User, ArrowLeftRight, Plus } from 'lucide-react';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <Link href="/user" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900">My Connected Apps</h1>
                <p className="text-xs text-slate-500">Manage your data sharing</p>
              </div>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Connect New App */}
              <Link
                href="/user/connect"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Connect App
              </Link>

              {/* Switch View */}
              <Link
                href="/bank"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Switch to Bank View
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
