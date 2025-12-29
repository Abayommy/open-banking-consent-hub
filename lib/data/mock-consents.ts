// lib/data/mock-consents.ts

import { Consent, ActivityLog } from '../types';

// Generate dates relative to now
const now = new Date();

const daysAgo = (days: number): string => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const daysFromNow = (days: number): string => {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const hoursAgo = (hours: number): string => {
  const date = new Date(now);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
};

export const initialConsents: Consent[] = [
  // Active consents
  {
    id: 'consent-001',
    tppId: 'tpp-001', // Budget Buddy
    userId: 'user-001',
    status: 'active',
    permissions: ['ReadAccountsBasic', 'ReadAccountsDetail', 'ReadBalances', 'ReadTransactionsDetail'],
    accountIds: ['acc-001', 'acc-002'],
    createdAt: daysAgo(45),
    authorizedAt: daysAgo(45),
    expiresAt: daysFromNow(45),
    revokedAt: null,
    lastAccessedAt: hoursAgo(2),
    accessCount: 127
  },
  {
    id: 'consent-002',
    tppId: 'tpp-003', // WealthView
    userId: 'user-001',
    status: 'active',
    permissions: ['ReadAccountsBasic', 'ReadBalances'],
    accountIds: ['acc-001', 'acc-002'],
    createdAt: daysAgo(30),
    authorizedAt: daysAgo(30),
    expiresAt: daysFromNow(60),
    revokedAt: null,
    lastAccessedAt: daysAgo(3),
    accessCount: 45
  },
  {
    id: 'consent-003',
    tppId: 'tpp-004', // InvoiceFlow
    userId: 'user-001',
    status: 'active',
    permissions: ['ReadAccountsDetail', 'ReadTransactionsDetail', 'InitiatePayments'],
    accountIds: ['acc-003'],
    createdAt: daysAgo(60),
    authorizedAt: daysAgo(60),
    expiresAt: daysFromNow(30),
    revokedAt: null,
    lastAccessedAt: hoursAgo(5),
    accessCount: 312
  },
  {
    id: 'consent-004',
    tppId: 'tpp-006', // Tink
    userId: 'user-001',
    status: 'active',
    permissions: ['ReadAccountsBasic', 'ReadBalances', 'ReadTransactionsBasic'],
    accountIds: ['acc-001'],
    createdAt: daysAgo(15),
    authorizedAt: daysAgo(15),
    expiresAt: daysFromNow(75),
    revokedAt: null,
    lastAccessedAt: daysAgo(2),
    accessCount: 28
  },

  // Expiring soon (within 7 days)
  {
    id: 'consent-005',
    tppId: 'tpp-007', // Plaid
    userId: 'user-001',
    status: 'active',
    permissions: ['ReadAccountsBasic', 'ReadAccountsDetail', 'ReadBalances'],
    accountIds: ['acc-001', 'acc-002', 'acc-003'],
    createdAt: daysAgo(85),
    authorizedAt: daysAgo(85),
    expiresAt: daysFromNow(5),
    revokedAt: null,
    lastAccessedAt: hoursAgo(18),
    accessCount: 203
  },

  // Another expiring soon
  {
    id: 'consent-008',
    tppId: 'tpp-008', // TrueLayer
    userId: 'user-001',
    status: 'active',
    permissions: ['ReadAccountsBasic', 'ReadBalances', 'InitiatePayments'],
    accountIds: ['acc-001'],
    createdAt: daysAgo(87),
    authorizedAt: daysAgo(87),
    expiresAt: daysFromNow(3),
    revokedAt: null,
    lastAccessedAt: daysAgo(1),
    accessCount: 156
  },

  // Revoked consent
  {
    id: 'consent-006',
    tppId: 'tpp-005', // LendSmart
    userId: 'user-001',
    status: 'revoked',
    permissions: ['ReadAccountsDetail', 'ReadTransactionsDetail'],
    accountIds: ['acc-001'],
    createdAt: daysAgo(120),
    authorizedAt: daysAgo(120),
    expiresAt: daysAgo(30),
    revokedAt: daysAgo(60),
    lastAccessedAt: daysAgo(60),
    accessCount: 89
  },

  // Expired consent
  {
    id: 'consent-007',
    tppId: 'tpp-002', // QuickPay Pro
    userId: 'user-001',
    status: 'expired',
    permissions: ['InitiatePayments'],
    accountIds: ['acc-001'],
    createdAt: daysAgo(100),
    authorizedAt: daysAgo(100),
    expiresAt: daysAgo(10),
    revokedAt: null,
    lastAccessedAt: daysAgo(15),
    accessCount: 42
  }
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'log-001',
    consentId: 'consent-001',
    tppId: 'tpp-001',
    action: 'accessed',
    timestamp: hoursAgo(2),
    details: 'Retrieved account balances',
    endpoint: 'GET /accounts/{accountId}/balances'
  },
  {
    id: 'log-002',
    consentId: 'consent-001',
    tppId: 'tpp-001',
    action: 'accessed',
    timestamp: hoursAgo(2),
    details: 'Retrieved transactions (last 30 days)',
    endpoint: 'GET /accounts/{accountId}/transactions'
  },
  {
    id: 'log-003',
    consentId: 'consent-003',
    tppId: 'tpp-004',
    action: 'accessed',
    timestamp: hoursAgo(5),
    details: 'Initiated payment of €1,250.00',
    endpoint: 'POST /payments'
  },
  {
    id: 'log-004',
    consentId: 'consent-003',
    tppId: 'tpp-004',
    action: 'accessed',
    timestamp: daysAgo(1),
    details: 'Retrieved transaction history',
    endpoint: 'GET /accounts/{accountId}/transactions'
  },
  {
    id: 'log-005',
    consentId: 'consent-005',
    tppId: 'tpp-007',
    action: 'accessed',
    timestamp: hoursAgo(18),
    details: 'Retrieved account list',
    endpoint: 'GET /accounts'
  },
  {
    id: 'log-006',
    consentId: 'consent-006',
    tppId: 'tpp-005',
    action: 'revoked',
    timestamp: daysAgo(60),
    details: 'User revoked consent',
    endpoint: undefined
  },
  {
    id: 'log-007',
    consentId: 'consent-001',
    tppId: 'tpp-001',
    action: 'authorized',
    timestamp: daysAgo(45),
    details: 'User authorized new consent',
    endpoint: undefined
  },
  {
    id: 'log-008',
    consentId: 'consent-002',
    tppId: 'tpp-003',
    action: 'accessed',
    timestamp: daysAgo(3),
    details: 'Retrieved account balances',
    endpoint: 'GET /accounts/{accountId}/balances'
  }
];

// Funnel data for demo
export const funnelData = {
  initiated: 156,
  redirected: 142,
  authenticated: 128,
  authorized: 118,
  active: 98
};

// Trend data for charts (last 14 days)
export const generateTrendData = () => {
  const data = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      created: Math.floor(Math.random() * 8) + 2,
      revoked: Math.floor(Math.random() * 3),
      expired: Math.floor(Math.random() * 2)
    });
  }
  return data;
};
