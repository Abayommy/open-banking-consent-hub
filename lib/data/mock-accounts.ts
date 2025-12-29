// lib/data/mock-accounts.ts

import { Account } from '../types';

export const mockAccounts: Account[] = [
  {
    id: 'acc-001',
    iban: 'IE29AIBK93115212345678',
    name: 'Main Current Account',
    type: 'current',
    currency: 'EUR',
    balance: 12450.00
  },
  {
    id: 'acc-002',
    iban: 'IE29AIBK93115287654321',
    name: 'Savings Account',
    type: 'savings',
    currency: 'EUR',
    balance: 45000.00
  },
  {
    id: 'acc-003',
    iban: 'IE29AIBK93115298765432',
    name: 'Business Account',
    type: 'business',
    currency: 'EUR',
    balance: 89750.50
  }
];

export const getAccountById = (id: string): Account | undefined => {
  return mockAccounts.find(account => account.id === id);
};

export const getAccountsByIds = (ids: string[]): Account[] => {
  return mockAccounts.filter(account => ids.includes(account.id));
};

export const formatIBAN = (iban: string): string => {
  return iban.replace(/(.{4})/g, '$1 ').trim();
};

export const maskIBAN = (iban: string): string => {
  return `${iban.slice(0, 4)}...${iban.slice(-4)}`;
};
