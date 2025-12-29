// lib/data/mock-tpps.ts

import { TPP } from '../types';

export const mockTPPs: TPP[] = [
  {
    id: 'tpp-001',
    name: 'Budget Buddy',
    logo: '💰',
    website: 'https://budgetbuddy.example.com',
    authorizationType: 'AISP',
    ncaRegistration: 'FCA-123456',
    registeredCountry: 'UK',
    description: 'Personal budgeting and expense tracking app',
    category: 'budgeting'
  },
  {
    id: 'tpp-002',
    name: 'QuickPay Pro',
    logo: '⚡',
    website: 'https://quickpay.example.com',
    authorizationType: 'PISP',
    ncaRegistration: 'BaFin-789012',
    registeredCountry: 'DE',
    description: 'Fast payment initiation for e-commerce',
    category: 'payments'
  },
  {
    id: 'tpp-003',
    name: 'WealthView',
    logo: '📊',
    website: 'https://wealthview.example.com',
    authorizationType: 'AISP',
    ncaRegistration: 'CSSF-345678',
    registeredCountry: 'LU',
    description: 'Investment portfolio aggregation and analysis',
    category: 'wealth'
  },
  {
    id: 'tpp-004',
    name: 'InvoiceFlow',
    logo: '📄',
    website: 'https://invoiceflow.example.com',
    authorizationType: 'AISP_PISP',
    ncaRegistration: 'DNB-901234',
    registeredCountry: 'NL',
    description: 'Business invoicing with automatic payment reconciliation',
    category: 'accounting'
  },
  {
    id: 'tpp-005',
    name: 'LendSmart',
    logo: '🏦',
    website: 'https://lendsmart.example.com',
    authorizationType: 'AISP',
    ncaRegistration: 'CBI-567890',
    registeredCountry: 'IE',
    description: 'Credit scoring and loan comparison',
    category: 'lending'
  },
  {
    id: 'tpp-006',
    name: 'Tink',
    logo: '🔗',
    website: 'https://tink.com',
    authorizationType: 'AISP_PISP',
    ncaRegistration: 'FI-FSA-112233',
    registeredCountry: 'SE',
    description: 'Open banking platform for financial services',
    category: 'budgeting'
  },
  {
    id: 'tpp-007',
    name: 'Plaid',
    logo: '🔌',
    website: 'https://plaid.com',
    authorizationType: 'AISP',
    ncaRegistration: 'FCA-445566',
    registeredCountry: 'UK',
    description: 'Financial data connectivity platform',
    category: 'accounting'
  },
  {
    id: 'tpp-008',
    name: 'TrueLayer',
    logo: '💳',
    website: 'https://truelayer.com',
    authorizationType: 'AISP_PISP',
    ncaRegistration: 'FCA-778899',
    registeredCountry: 'UK',
    description: 'Open banking payments and data',
    category: 'payments'
  }
];

export const getTPPById = (id: string): TPP | undefined => {
  return mockTPPs.find(tpp => tpp.id === id);
};

export const getTPPsByCategory = (category: TPP['category']): TPP[] => {
  return mockTPPs.filter(tpp => tpp.category === category);
};
