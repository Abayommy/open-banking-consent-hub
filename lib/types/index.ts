// lib/types/index.ts

// Third Party Provider
export interface TPP {
  id: string;
  name: string;
  logo: string;
  website: string;
  authorizationType: 'AISP' | 'PISP' | 'AISP_PISP' | 'CBPII';
  ncaRegistration: string;
  registeredCountry: string;
  description: string;
  category: 'budgeting' | 'accounting' | 'payments' | 'lending' | 'wealth';
}

// User Account
export interface Account {
  id: string;
  iban: string;
  name: string;
  type: 'current' | 'savings' | 'business';
  currency: string;
  balance: number;
}

// Permission Types
export type Permission =
  | 'ReadAccountsBasic'
  | 'ReadAccountsDetail'
  | 'ReadBalances'
  | 'ReadTransactionsBasic'
  | 'ReadTransactionsDetail'
  | 'ReadStandingOrdersBasic'
  | 'ReadStandingOrdersDetail'
  | 'ReadDirectDebits'
  | 'ReadBeneficiariesBasic'
  | 'ReadBeneficiariesDetail'
  | 'InitiatePayments';

// Permission with friendly name
export interface PermissionDetail {
  code: Permission;
  name: string;
  description: string;
  category: 'account' | 'transaction' | 'payment';
  riskLevel: 'low' | 'medium' | 'high';
}

// Consent Status
export type ConsentStatus =
  | 'pending'
  | 'authorized'
  | 'active'
  | 'expired'
  | 'revoked'
  | 'rejected';

// Consent Record
export interface Consent {
  id: string;
  tppId: string;
  userId: string;
  status: ConsentStatus;
  permissions: Permission[];
  accountIds: string[];
  createdAt: string;
  authorizedAt: string | null;
  expiresAt: string;
  revokedAt: string | null;
  lastAccessedAt: string | null;
  accessCount: number;
}

// Activity Log Entry
export interface ActivityLog {
  id: string;
  consentId: string;
  tppId: string;
  action: 'created' | 'authorized' | 'accessed' | 'revoked' | 'expired' | 'renewed';
  timestamp: string;
  details: string;
  endpoint?: string;
}

// Consent Funnel Metrics
export interface FunnelMetrics {
  initiated: number;
  redirected: number;
  authenticated: number;
  authorized: number;
  active: number;
}

// TPP Performance Metrics
export interface TPPMetrics {
  tppId: string;
  activeConsents: number;
  totalConsents: number;
  avgConsentDuration: number;
  revocationRate: number;
  lastActivity: string;
  riskScore: 'low' | 'medium' | 'high';
}

// Permission details lookup
export const PERMISSION_DETAILS: Record<Permission, PermissionDetail> = {
  ReadAccountsBasic: {
    code: 'ReadAccountsBasic',
    name: 'View account names',
    description: 'Can see your account names and types',
    category: 'account',
    riskLevel: 'low'
  },
  ReadAccountsDetail: {
    code: 'ReadAccountsDetail',
    name: 'View account details',
    description: 'Can see your account names, IBANs, and types',
    category: 'account',
    riskLevel: 'low'
  },
  ReadBalances: {
    code: 'ReadBalances',
    name: 'View balances',
    description: 'Can see your current account balances',
    category: 'account',
    riskLevel: 'low'
  },
  ReadTransactionsBasic: {
    code: 'ReadTransactionsBasic',
    name: 'View transaction summaries',
    description: 'Can see basic transaction information',
    category: 'transaction',
    riskLevel: 'medium'
  },
  ReadTransactionsDetail: {
    code: 'ReadTransactionsDetail',
    name: 'View transaction details',
    description: 'Can see your full transaction history (last 90 days)',
    category: 'transaction',
    riskLevel: 'medium'
  },
  ReadStandingOrdersBasic: {
    code: 'ReadStandingOrdersBasic',
    name: 'View standing orders',
    description: 'Can see your scheduled payments',
    category: 'transaction',
    riskLevel: 'medium'
  },
  ReadStandingOrdersDetail: {
    code: 'ReadStandingOrdersDetail',
    name: 'View standing order details',
    description: 'Can see full details of your scheduled payments',
    category: 'transaction',
    riskLevel: 'medium'
  },
  ReadDirectDebits: {
    code: 'ReadDirectDebits',
    name: 'View direct debits',
    description: 'Can see your direct debit mandates',
    category: 'transaction',
    riskLevel: 'medium'
  },
  ReadBeneficiariesBasic: {
    code: 'ReadBeneficiariesBasic',
    name: 'View saved payees',
    description: 'Can see your saved payment recipients',
    category: 'transaction',
    riskLevel: 'medium'
  },
  ReadBeneficiariesDetail: {
    code: 'ReadBeneficiariesDetail',
    name: 'View payee details',
    description: 'Can see full details of your saved recipients',
    category: 'transaction',
    riskLevel: 'medium'
  },
  InitiatePayments: {
    code: 'InitiatePayments',
    name: 'Make payments',
    description: 'Can initiate payments from your accounts',
    category: 'payment',
    riskLevel: 'high'
  }
};
