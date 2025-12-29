'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useConsentStore } from '@/lib/store/consent-store';
import { getTPPById } from '@/lib/data/mock-tpps';
import { getAccountsByIds } from '@/lib/data/mock-accounts';
import { PERMISSION_DETAILS } from '@/lib/types';
import { formatRelativeTime, daysUntil } from '@/lib/utils';
import { 
  ChevronRight, 
  Shield, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  CreditCard,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Revoke Confirmation Modal
function RevokeModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  tppName 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tppName: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Revoke Access?</h3>
        </div>
        <p className="text-slate-600 mb-6">
          Are you sure you want to revoke <strong>{tppName}</strong>&apos;s access to your accounts? 
          They will no longer be able to view your data or make payments on your behalf.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Revoke Access
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Connected App Card
function ConnectedAppCard({ consent }: { consent: any }) {
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const revokeConsent = useConsentStore((state) => state.revokeConsent);
  const renewConsent = useConsentStore((state) => state.renewConsent);

  const tpp = getTPPById(consent.tppId);
  const accounts = getAccountsByIds(consent.accountIds);
  const daysLeft = daysUntil(consent.expiresAt);
  const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;
  const hasPaymentPermission = consent.permissions.includes('InitiatePayments');

  if (!tpp) return null;

  const handleRevoke = () => {
    revokeConsent(consent.id);
    setShowRevokeModal(false);
  };

  const handleRenew = () => {
    renewConsent(consent.id);
  };

  return (
    <>
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-3xl">
              {tpp.logo}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">{tpp.name}</h3>
              <p className="text-sm text-slate-500">{tpp.description}</p>
            </div>
          </div>
          
          {/* Status Badge */}
          {consent.status === 'active' && !isExpiringSoon && (
            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              <CheckCircle className="h-4 w-4" />
              Active
            </span>
          )}
          {isExpiringSoon && (
            <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
              <AlertTriangle className="h-4 w-4" />
              Expiring Soon
            </span>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Eye className="h-4 w-4 text-slate-400" />
            <span>Can access: {accounts.map(a => a.name.split(' ')[0]).join(', ')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className={isExpiringSoon ? 'text-amber-600 font-medium' : ''}>
              Expires in {daysLeft} days
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Shield className="h-4 w-4 text-slate-400" />
            <span>{consent.permissions.length} permissions</span>
          </div>
          {hasPaymentPermission && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <CreditCard className="h-4 w-4" />
              <span>Can make payments</span>
            </div>
          )}
        </div>

        {/* Last Accessed */}
        {consent.lastAccessedAt && (
          <p className="text-sm text-slate-500 mb-4">
            Last accessed: {formatRelativeTime(consent.lastAccessedAt)}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <Link
            href={`/user/apps/${consent.id}`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            View Details
            <ChevronRight className="h-4 w-4" />
          </Link>
          {isExpiringSoon && (
            <button
              onClick={handleRenew}
              className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
            >
              Renew Access
            </button>
          )}
          <button
            onClick={() => setShowRevokeModal(true)}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
          >
            Revoke Access
          </button>
        </div>
      </motion.div>

      <RevokeModal
        isOpen={showRevokeModal}
        onClose={() => setShowRevokeModal(false)}
        onConfirm={handleRevoke}
        tppName={tpp.name}
      />
    </>
  );
}

// Revoked/Expired App Card (Collapsed)
function InactiveAppCard({ consent }: { consent: any }) {
  const tpp = getTPPById(consent.tppId);
  if (!tpp) return null;

  return (
    <div className="bg-white/50 rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl opacity-50">
            {tpp.logo}
          </div>
          <div>
            <h3 className="font-medium text-slate-600">{tpp.name}</h3>
            <p className="text-sm text-slate-400">
              {consent.status === 'revoked' 
                ? `Revoked ${formatRelativeTime(consent.revokedAt)}`
                : `Expired ${formatRelativeTime(consent.expiresAt)}`
              }
            </p>
          </div>
        </div>
        <span className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full ${
          consent.status === 'revoked' 
            ? 'bg-red-50 text-red-600' 
            : 'bg-slate-100 text-slate-500'
        }`}>
          <XCircle className="h-4 w-4" />
          {consent.status.charAt(0).toUpperCase() + consent.status.slice(1)}
        </span>
      </div>
    </div>
  );
}

export default function UserPortal() {
  const consents = useConsentStore((state) => state.consents);

  const activeConsents = consents.filter(c => c.status === 'active');
  const inactiveConsents = consents.filter(c => c.status === 'revoked' || c.status === 'expired');

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Connected Apps</h2>
        <p className="text-slate-600 mt-1">
          You have {activeConsents.length} app{activeConsents.length !== 1 ? 's' : ''} connected to your accounts
        </p>
      </div>

      {/* Active Consents */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {activeConsents.map((consent) => (
            <ConnectedAppCard key={consent.id} consent={consent} />
          ))}
        </AnimatePresence>

        {activeConsents.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Connected Apps</h3>
            <p className="text-slate-500 mb-6">
              You haven&apos;t connected any apps to your bank accounts yet.
            </p>
            <Link
              href="/user/connect"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Connect Your First App
            </Link>
          </div>
        )}
      </div>

      {/* Inactive Consents */}
      {inactiveConsents.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
            Previously Connected
          </h3>
          <div className="space-y-3">
            {inactiveConsents.map((consent) => (
              <InactiveAppCard key={consent.id} consent={consent} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
