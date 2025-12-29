'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, User, ArrowRight, Shield, RefreshCw, Eye } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6">
        <div className="flex items-center gap-2 text-white/80">
          <Shield className="h-6 w-6" />
          <span className="font-semibold">Open Banking Consent Hub</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Open Banking Consent Hub
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Experience PSD2 consent management from every perspective.
            See how banks monitor consent and how users manage their connected apps.
          </p>
        </motion.div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
          {/* Bank Dashboard Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/bank">
              <div className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:bg-white/10 cursor-pointer h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="h-8 w-8 text-blue-400" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-3">Bank Dashboard</h2>
                  <p className="text-slate-400 mb-6">
                    Monitor consent metrics, track TPP performance, view compliance analytics, and manage alerts.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">Analytics</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">TPP Monitoring</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">Compliance</span>
                  </div>
                  
                  <div className="flex items-center text-blue-400 font-medium group-hover:gap-3 gap-2 transition-all duration-300">
                    Enter Bank View <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* User Portal Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/user">
              <div className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:bg-white/10 cursor-pointer h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <User className="h-8 w-8 text-green-400" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-3">User Portal</h2>
                  <p className="text-slate-400 mb-6">
                    View connected apps, manage permissions, revoke access, and connect new services.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full">My Apps</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full">Permissions</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full">Security</span>
                  </div>
                  
                  <div className="flex items-center text-green-400 font-medium group-hover:gap-3 gap-2 transition-all duration-300">
                    Enter User View <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-3xl"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <RefreshCw className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-white font-medium mb-1">Real-time Sync</h3>
            <p className="text-sm text-slate-500">Actions reflect across views</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-white font-medium mb-1">PSD2 Compliant</h3>
            <p className="text-sm text-slate-500">Berlin Group specifications</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Eye className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-white font-medium mb-1">Full Visibility</h3>
            <p className="text-sm text-slate-500">Both sides of consent</p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-500 text-sm">
            Built to demonstrate PSD2 Open Banking consent management
          </p>
          <p className="text-slate-600 text-xs mt-2">
            A portfolio project by Abayomi Ajayi
          </p>
        </motion.div>
      </div>
    </main>
  );
}
