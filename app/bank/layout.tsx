'use client';

import Link from 'next/link';
import { Building2, Bell, ArrowLeftRight } from 'lucide-react';
import { useConsentStore } from '@/lib/store/consent-store';

export default function BankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const expiringSoon = useConsentStore((state) => state.getExpiringSoon(7));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900">Bank Dashboard</h1>
                <p className="text-xs text-slate-500">Consent Management Portal</p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Alerts */}
              <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                {expiringSoon.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {expiringSoon.length}
                  </span>
                )}
              </button>

              {/* Switch View */}
              <Link
                href="/user"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Switch to User View
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
