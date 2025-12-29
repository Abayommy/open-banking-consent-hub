// lib/store/consent-store.ts

import { create } from 'zustand';
import { Consent, ActivityLog, ConsentStatus, Permission } from '../types';
import { initialConsents, initialActivityLogs } from '../data/mock-consents';

interface ConsentStore {
  consents: Consent[];
  activityLogs: ActivityLog[];

  // Actions
  revokeConsent: (consentId: string) => void;
  renewConsent: (consentId: string) => void;
  addConsent: (tppId: string, permissions: Permission[], accountIds: string[]) => void;
  addActivityLog: (log: Omit<ActivityLog, 'id'>) => void;

  // Selectors
  getConsentById: (id: string) => Consent | undefined;
  getConsentsByStatus: (status: ConsentStatus) => Consent[];
  getConsentsByTPP: (tppId: string) => Consent[];
  getActiveConsents: () => Consent[];
  getExpiringSoon: (days: number) => Consent[];
  getActivityLogsForConsent: (consentId: string) => ActivityLog[];

  // Computed metrics
  getTotalActive: () => number;
  getTotalExpiringSoon: () => number;
  getConsentCountByStatus: () => Record<ConsentStatus, number>;
}

export const useConsentStore = create<ConsentStore>((set, get) => ({
  consents: initialConsents,
  activityLogs: initialActivityLogs,

  revokeConsent: (consentId: string) => {
    const now = new Date().toISOString();
    const consent = get().consents.find(c => c.id === consentId);

    if (!consent) return;

    set((state) => ({
      consents: state.consents.map((c) =>
        c.id === consentId
          ? { ...c, status: 'revoked' as ConsentStatus, revokedAt: now }
          : c
      ),
      activityLogs: [
        {
          id: `log-${Date.now()}`,
          consentId,
          tppId: consent.tppId,
          action: 'revoked' as const,
          timestamp: now,
          details: 'User revoked consent'
        },
        ...state.activityLogs
      ]
    }));
  },

  renewConsent: (consentId: string) => {
    const now = new Date();
    const newExpiry = new Date(now);
    newExpiry.setDate(newExpiry.getDate() + 90);
    const consent = get().consents.find(c => c.id === consentId);

    if (!consent) return;

    set((state) => ({
      consents: state.consents.map((c) =>
        c.id === consentId
          ? {
              ...c,
              expiresAt: newExpiry.toISOString(),
              status: 'active' as ConsentStatus
            }
          : c
      ),
      activityLogs: [
        {
          id: `log-${Date.now()}`,
          consentId,
          tppId: consent.tppId,
          action: 'renewed' as const,
          timestamp: now.toISOString(),
          details: 'User renewed consent for 90 days'
        },
        ...state.activityLogs
      ]
    }));
  },

  addConsent: (tppId: string, permissions: Permission[], accountIds: string[]) => {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + 90);

    const newConsent: Consent = {
      id: `consent-${Date.now()}`,
      tppId,
      userId: 'user-001',
      status: 'active',
      permissions,
      accountIds,
      createdAt: now.toISOString(),
      authorizedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      revokedAt: null,
      lastAccessedAt: null,
      accessCount: 0
    };

    set((state) => ({
      consents: [newConsent, ...state.consents],
      activityLogs: [
        {
          id: `log-${Date.now()}`,
          consentId: newConsent.id,
          tppId,
          action: 'authorized' as const,
          timestamp: now.toISOString(),
          details: 'User authorized new consent'
        },
        ...state.activityLogs
      ]
    }));
  },

  addActivityLog: (log: Omit<ActivityLog, 'id'>) => {
    set((state) => ({
      activityLogs: [
        { ...log, id: `log-${Date.now()}` },
        ...state.activityLogs
      ]
    }));
  },

  getConsentById: (id: string) => {
    return get().consents.find((c) => c.id === id);
  },

  getConsentsByStatus: (status: ConsentStatus) => {
    return get().consents.filter((c) => c.status === status);
  },

  getConsentsByTPP: (tppId: string) => {
    return get().consents.filter((c) => c.tppId === tppId);
  },

  getActiveConsents: () => {
    return get().consents.filter((c) => c.status === 'active');
  },

  getExpiringSoon: (days: number) => {
    const now = new Date();
    const threshold = new Date(now);
    threshold.setDate(threshold.getDate() + days);

    return get().consents.filter(
      (c) =>
        c.status === 'active' &&
        new Date(c.expiresAt) <= threshold &&
        new Date(c.expiresAt) > now
    );
  },

  getActivityLogsForConsent: (consentId: string) => {
    return get().activityLogs.filter((log) => log.consentId === consentId);
  },

  getTotalActive: () => {
    return get().consents.filter((c) => c.status === 'active').length;
  },

  getTotalExpiringSoon: () => {
    return get().getExpiringSoon(7).length;
  },

  getConsentCountByStatus: () => {
    const consents = get().consents;
    return {
      pending: consents.filter(c => c.status === 'pending').length,
      authorized: consents.filter(c => c.status === 'authorized').length,
      active: consents.filter(c => c.status === 'active').length,
      expired: consents.filter(c => c.status === 'expired').length,
      revoked: consents.filter(c => c.status === 'revoked').length,
      rejected: consents.filter(c => c.status === 'rejected').length
    };
  }
}));
