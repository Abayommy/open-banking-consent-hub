'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useConsentStore } from '@/lib/store/consent-store';
import { mockTPPs } from '@/lib/data/mock-tpps';
import { mockAccounts } from '@/lib/data/mock-accounts';
import { Permission, PERMISSION_DETAILS } from '@/lib/types';
import { formatCurrency, maskIBAN } from '@/lib/utils';
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  Shield,
  Building2,
  Search,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'select-tpp' | 'select-accounts' | 'review-permissions' | 'authenticate' | 'success';

const AVAILABLE_PERMISSIONS: Permission[] = [
  'ReadAccountsBasic',
  'ReadAccountsDetail',
  'ReadBalances',
  'ReadTransactionsBasic',
  'ReadTransactionsDetail',
  'InitiatePayments'
];

export default function ConnectAppPage() {
  const router = useRouter();
  const addConsent = useConsentStore((state) => state.addConsent);
  const consents = useConsentStore((state) => state.consents);

  const [step, setStep] = useState<Step>('select-tpp');
  const [selectedTPP, setSelectedTPP] = useState<string | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([
    'ReadAccountsBasic',
    'ReadBalances'
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Filter out TPPs that already have active consents
  const activeTPPIds = consents.filter(c => c.status === 'active').map(c => c.tppId);
  const availableTPPs = mockTPPs.filter(tpp => 
    !activeTPPIds.includes(tpp.id) &&
    (tpp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     tpp.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedTPPData = mockTPPs.find(t => t.id === selectedTPP);

  const handleSelectTPP = (tppId: string) => {
    setSelectedTPP(tppId);
    const tpp = mockTPPs.find(t => t.id === tppId);
    // Pre-select permissions based on TPP type
    if (tpp?.authorizationType === 'PISP' || tpp?.authorizationType === 'AISP_PISP') {
      setSelectedPermissions(['ReadAccountsBasic', 'ReadBalances', 'InitiatePayments']);
    } else {
      setSelectedPermissions(['ReadAccountsBasic', 'ReadBalances', 'ReadTransactionsBasic']);
    }
    setStep('select-accounts');
  };

  const handleToggleAccount = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId)
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleTogglePermission = (permission: Permission) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAuthenticating(false);
    setStep('success');
    
    // Add the consent
    if (selectedTPP) {
      addConsent(selectedTPP, selectedPermissions, selectedAccounts);
    }
  };

  const stepNumber = {
    'select-tpp': 1,
    'select-accounts': 2,
    'review-permissions': 3,
    'authenticate': 4,
    'success': 5
  }[step];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      {step !== 'success' && (
        <button 
          onClick={() => {
            if (step === 'select-tpp') {
              router.push('/user');
            } else if (step === 'select-accounts') {
              setStep('select-tpp');
            } else if (step === 'review-permissions') {
              setStep('select-accounts');
            } else if (step === 'authenticate') {
              setStep('review-permissions');
            }
          }}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {step === 'select-tpp' ? 'Back to My Apps' : 'Back'}
        </button>
      )}

      {/* Progress Steps */}
      {step !== 'success' && (
        <div className="flex items-center gap-2">
          {['Select App', 'Accounts', 'Permissions', 'Authenticate'].map((label, index) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index + 1 < stepNumber
                  ? 'bg-green-100 text-green-700'
                  : index + 1 === stepNumber
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {index + 1 < stepNumber ? <CheckCircle className="h-5 w-5" /> : index + 1}
              </div>
              <span className={`text-sm hidden sm:inline ${
                index + 1 === stepNumber ? 'text-slate-900 font-medium' : 'text-slate-400'
              }`}>
                {label}
              </span>
              {index < 3 && (
                <div className={`w-8 h-0.5 ${
                  index + 1 < stepNumber ? 'bg-green-200' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Select TPP */}
        {step === 'select-tpp' && (
          <motion.div
            key="select-tpp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Connect a New App</h1>
              <p className="text-slate-600 mt-1">Choose an app to connect to your bank accounts</p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* TPP List */}
            <div className="space-y-3">
              {availableTPPs.map((tpp) => (
                <button
                  key={tpp.id}
                  onClick={() => handleSelectTPP(tpp.id)}
                  className="w-full flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all text-left"
                >
                  <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-3xl">
                    {tpp.logo}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{tpp.name}</h3>
                    <p className="text-sm text-slate-500">{tpp.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-400">{tpp.authorizationType}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400">{tpp.registeredCountry}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </button>
              ))}

              {availableTPPs.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  {searchQuery ? 'No apps found matching your search' : 'All apps are already connected'}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 2: Select Accounts */}
        {step === 'select-accounts' && (
          <motion.div
            key="select-accounts"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Select Accounts</h1>
              <p className="text-slate-600 mt-1">
                Choose which accounts {selectedTPPData?.name} can access
              </p>
            </div>

            <div className="space-y-3">
              {mockAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleToggleAccount(account.id)}
                  className={`w-full flex items-center gap-4 p-4 border rounded-xl transition-all text-left ${
                    selectedAccounts.includes(account.id)
                      ? 'bg-green-50 border-green-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAccounts.includes(account.id)
                      ? 'bg-green-600 border-green-600'
                      : 'border-slate-300'
                  }`}>
                    {selectedAccounts.includes(account.id) && (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">{account.name}</h3>
                    <p className="text-sm text-slate-500">{maskIBAN(account.iban)}</p>
                  </div>
                  <p className="font-medium text-slate-900">{formatCurrency(account.balance)}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep('review-permissions')}
              disabled={selectedAccounts.length === 0}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {/* Step 3: Review Permissions */}
        {step === 'review-permissions' && (
          <motion.div
            key="review-permissions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Review Permissions</h1>
              <p className="text-slate-600 mt-1">
                Choose what {selectedTPPData?.name} can do with your data
              </p>
            </div>

            <div className="space-y-3">
              {AVAILABLE_PERMISSIONS.map((permission) => {
                const detail = PERMISSION_DETAILS[permission];
                const isRequired = permission === 'ReadAccountsBasic';
                return (
                  <button
                    key={permission}
                    onClick={() => !isRequired && handleTogglePermission(permission)}
                    disabled={isRequired}
                    className={`w-full flex items-center gap-4 p-4 border rounded-xl transition-all text-left ${
                      selectedPermissions.includes(permission)
                        ? 'bg-green-50 border-green-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    } ${isRequired ? 'opacity-75' : ''}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPermissions.includes(permission)
                        ? 'bg-green-600 border-green-600'
                        : 'border-slate-300'
                    }`}>
                      {selectedPermissions.includes(permission) && (
                        <CheckCircle className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-900">{detail.name}</h3>
                        {isRequired && (
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Required</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{detail.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      detail.riskLevel === 'high'
                        ? 'bg-amber-100 text-amber-700'
                        : detail.riskLevel === 'medium'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {detail.riskLevel.charAt(0).toUpperCase() + detail.riskLevel.slice(1)}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep('authenticate')}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Continue to Authentication
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {/* Step 4: Authenticate */}
        {step === 'authenticate' && (
          <motion.div
            key="authenticate"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Authenticate</h1>
              <p className="text-slate-600 mt-2">
                Confirm your identity to authorize {selectedTPPData?.name}
              </p>
            </div>

            {/* Summary */}
            <div className="bg-slate-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl">
                  {selectedTPPData?.logo}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{selectedTPPData?.name}</h3>
                  <p className="text-sm text-slate-500">{selectedTPPData?.authorizationType}</p>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-500 mb-2">Accounts:</p>
                <p className="font-medium text-slate-900">
                  {mockAccounts.filter(a => selectedAccounts.includes(a.id)).map(a => a.name).join(', ')}
                </p>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-500 mb-2">Permissions:</p>
                <p className="font-medium text-slate-900">
                  {selectedPermissions.length} permissions granted
                </p>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-500 mb-2">Duration:</p>
                <p className="font-medium text-slate-900">90 days (can be revoked anytime)</p>
              </div>
            </div>

            <button
              onClick={handleAuthenticate}
              disabled={isAuthenticating}
              className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isAuthenticating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  Authorize Access
                </>
              )}
            </button>

            <p className="text-xs text-slate-500 text-center">
              By continuing, you agree to share your selected account data with {selectedTPPData?.name}.
              You can revoke access at any time from your Connected Apps.
            </p>
          </motion.div>
        )}

        {/* Step 5: Success */}
        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="h-12 w-12 text-green-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Successfully Connected!</h1>
            <p className="text-slate-600 mb-8">
              {selectedTPPData?.name} now has access to your selected accounts.
            </p>
            <Link
              href="/user"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors"
            >
              View My Connected Apps
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
