'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useConsentStore } from '@/lib/store/consent-store';
import { getTPPById } from '@/lib/data/mock-tpps';
import { getAccountsByIds, maskIBAN } from '@/lib/data/mock-accounts';
import { PERMISSION_DETAILS } from '@/lib/types';
import { formatDate, formatRelativeTime, daysUntil, formatCurrency } from '@/lib/utils';
import { 
  ArrowLeft, 
  Shield, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
  Trash2,
  Activity,
  Building2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConsentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const consentId = params.consentId as string;

  const consent = useConsentStore((state) => state.getConsentById(consentId));
  const activityLogs = useConsentStore((state) => state.getActivityLogsForConsent(consentId));
  const revokeConsent = useConsentStore((state) => state.revokeConsent);
  const renewConsent = useConsentStore((state) => state.renewConsent);

  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);

  if (!consent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-900">Consent not found</h2>
        <Link href="/user" className="text-green-600 hover:underline mt-2 inline-block">
          Back to My Apps
        </Link>
      </div>
    );
  }

  const tpp = getTPPById(consent.tppId);
  const accounts = getAccountsByIds(consent.accountIds);
  const daysLeft = daysUntil(consent.expiresAt);
  const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;
  const isActive = consent.status === 'active';

  if (!tpp) return null;

  const handleRevoke = () => {
    revokeConsent(consent.id);
    router.push('/user');
  };

  const handleRenew = () => {
    renewConsent(consent.id);
  };

  // Group permissions by category
  const permissionsByCategory = consent.permissions.reduce((acc, perm) => {
    const detail = PERMISSION_DETAILS[perm];
    if (!acc[detail.category]) {
      acc[detail.category] = [];
    }
    acc[detail.category].push(detail);
    return acc;
  }, {} as Record<string, typeof PERMISSION_DETAILS[keyof typeof PERMISSION_DETAILS][]>);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link 
        href="/user"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Apps
      </Link>

      {/* Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
      >
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-4xl">
            {tpp.logo}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{tpp.name}</h1>
                <a 
                  href={tpp.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1"
                >
                  {tpp.website.replace('https://', '')}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              
              {/* Status Badge */}
              {isActive && !isExpiringSoon && (
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
              {consent.status === 'revoked' && (
                <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                  <XCircle className="h-4 w-4" />
                  Revoked
                </span>
              )}
            </div>
            
            <div className="mt-4 flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400" />
                Regulated by {tpp.ncaRegistration.split('-')[0]} ({tpp.registeredCountry})
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-400" />
                {tpp.authorizationType}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Status Details */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Consent Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-slate-500 mb-1">Connected</p>
            <p className="font-medium text-slate-900">{formatDate(consent.createdAt)}</p>
            <p className="text-xs text-slate-500">{daysUntil(consent.createdAt) * -1} days ago</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Expires</p>
            <p className={`font-medium ${isExpiringSoon ? 'text-amber-600' : 'text-slate-900'}`}>
              {formatDate(consent.expiresAt)}
            </p>
            <p className={`text-xs ${isExpiringSoon ? 'text-amber-500' : 'text-slate-500'}`}>
              {isActive ? `in ${daysLeft} days` : 'Expired'}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Last Accessed</p>
            <p className="font-medium text-slate-900">
              {consent.lastAccessedAt ? formatRelativeTime(consent.lastAccessedAt) : 'Never'}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Total Accesses</p>
            <p className="font-medium text-slate-900">{consent.accessCount} times</p>
          </div>
        </div>
      </motion.div>

      {/* Permissions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Permissions Granted</h2>
        <div className="space-y-6">
          {Object.entries(permissionsByCategory).map(([category, permissions]) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                {category === 'account' ? 'Account Access' : category === 'transaction' ? 'Transaction Access' : 'Payment Access'}
              </h3>
              <div className="space-y-3">
                {permissions.map((perm) => (
                  <div key={perm.code} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <CheckCircle className={`h-5 w-5 mt-0.5 ${
                      perm.riskLevel === 'high' ? 'text-amber-500' : 'text-green-500'
                    }`} />
                    <div>
                      <p className="font-medium text-slate-900">{perm.name}</p>
                      <p className="text-sm text-slate-500">{perm.description}</p>
                    </div>
                    <span className={`ml-auto px-2 py-1 text-xs font-medium rounded ${
                      perm.riskLevel === 'high' 
                        ? 'bg-amber-100 text-amber-700'
                        : perm.riskLevel === 'medium'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {perm.riskLevel.charAt(0).toUpperCase() + perm.riskLevel.slice(1)} Risk
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Accounts Shared */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Accounts Shared</h2>
        <div className="space-y-3">
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">{account.name}</p>
                <p className="text-sm text-slate-500">{maskIBAN(account.iban)}</p>
              </div>
              <p className="font-medium text-slate-900">{formatCurrency(account.balance)}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Activity Log */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
        {activityLogs.length > 0 ? (
          <div className="space-y-4">
            {activityLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  log.action === 'accessed' ? 'bg-blue-100' :
                  log.action === 'authorized' ? 'bg-green-100' :
                  log.action === 'revoked' ? 'bg-red-100' :
                  log.action === 'renewed' ? 'bg-amber-100' :
                  'bg-slate-100'
                }`}>
                  <Activity className={`h-4 w-4 ${
                    log.action === 'accessed' ? 'text-blue-600' :
                    log.action === 'authorized' ? 'text-green-600' :
                    log.action === 'revoked' ? 'text-red-600' :
                    log.action === 'renewed' ? 'text-amber-600' :
                    'text-slate-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-slate-900">{log.details}</p>
                  {log.endpoint && (
                    <code className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded mt-1 inline-block">
                      {log.endpoint}
                    </code>
                  )}
                </div>
                <p className="text-sm text-slate-500">{formatRelativeTime(log.timestamp)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No activity recorded yet</p>
        )}
      </motion.div>

      {/* Actions */}
      {isActive && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            {isExpiringSoon && (
              <button
                onClick={handleRenew}
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Renew for 90 Days
              </button>
            )}
            
            {!showRevokeConfirm ? (
              <button
                onClick={() => setShowRevokeConfirm(true)}
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Revoke Access
              </button>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-700 text-sm">Are you sure you want to revoke access?</p>
                <button
                  onClick={handleRevoke}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Yes, Revoke
                </button>
                <button
                  onClick={() => setShowRevokeConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
