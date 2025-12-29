'use client';

import { useConsentStore } from '@/lib/store/consent-store';
import { mockTPPs, getTPPById } from '@/lib/data/mock-tpps';
import { funnelData, generateTrendData } from '@/lib/data/mock-consents';
import { formatRelativeTime, formatPercentage } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  change, 
  changeLabel,
  alert,
  icon: Icon
}: { 
  title: string;
  value: number;
  change?: number;
  changeLabel?: string;
  alert?: boolean;
  icon?: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        {alert && <AlertTriangle className="h-4 w-4 text-amber-500" />}
        {Icon && !alert && <Icon className="h-4 w-4 text-slate-400" />}
      </div>
      <p className="text-3xl font-bold text-slate-900">{value.toLocaleString()}</p>
      {change !== undefined && (
        <div className={`mt-2 flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
          <span>{Math.abs(change)}%</span>
          {changeLabel && <span className="text-slate-500 ml-1">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}

// Status colors for charts
const STATUS_COLORS = {
  active: '#22c55e',
  expiring: '#f59e0b',
  expired: '#94a3b8',
  revoked: '#ef4444',
};

export default function BankDashboard() {
  const consents = useConsentStore((state) => state.consents);
  const getActiveConsents = useConsentStore((state) => state.getActiveConsents);
  const getExpiringSoon = useConsentStore((state) => state.getExpiringSoon);
  const getConsentCountByStatus = useConsentStore((state) => state.getConsentCountByStatus);

  const activeConsents = getActiveConsents();
  const expiringSoon = getExpiringSoon(7);
  const statusCounts = getConsentCountByStatus();
  const trendData = generateTrendData();

  // Calculate metrics
  const totalActive = activeConsents.length;
  const totalExpiring = expiringSoon.length;
  const revokedToday = consents.filter(c => {
    if (c.status !== 'revoked' || !c.revokedAt) return false;
    const revoked = new Date(c.revokedAt);
    const today = new Date();
    return revoked.toDateString() === today.toDateString();
  }).length;
  const newToday = consents.filter(c => {
    const created = new Date(c.createdAt);
    const today = new Date();
    return created.toDateString() === today.toDateString();
  }).length;

  // Pie chart data
  const pieData = [
    { name: 'Active', value: statusCounts.active, color: STATUS_COLORS.active },
    { name: 'Expiring Soon', value: expiringSoon.length, color: STATUS_COLORS.expiring },
    { name: 'Expired', value: statusCounts.expired, color: STATUS_COLORS.expired },
    { name: 'Revoked', value: statusCounts.revoked, color: STATUS_COLORS.revoked },
  ].filter(d => d.value > 0);

  // Funnel data for bar chart
  const funnelChartData = [
    { name: 'Initiated', value: funnelData.initiated, fill: '#93c5fd' },
    { name: 'Redirected', value: funnelData.redirected, fill: '#60a5fa' },
    { name: 'Authenticated', value: funnelData.authenticated, fill: '#3b82f6' },
    { name: 'Authorized', value: funnelData.authorized, fill: '#2563eb' },
    { name: 'Active', value: funnelData.active, fill: '#1d4ed8' },
  ];

  // TPP metrics
  const tppMetrics = mockTPPs.map(tpp => {
    const tppConsents = consents.filter(c => c.tppId === tpp.id);
    const activeCount = tppConsents.filter(c => c.status === 'active').length;
    const revokedCount = tppConsents.filter(c => c.status === 'revoked').length;
    const revocationRate = tppConsents.length > 0 ? (revokedCount / tppConsents.length) * 100 : 0;
    
    return {
      ...tpp,
      activeConsents: activeCount,
      totalConsents: tppConsents.length,
      revocationRate,
      riskScore: revocationRate > 10 ? 'high' : revocationRate > 5 ? 'medium' : 'low',
      lastActivity: tppConsents.length > 0 
        ? tppConsents.reduce((latest, c) => 
            new Date(c.lastAccessedAt || c.createdAt) > new Date(latest) 
              ? (c.lastAccessedAt || c.createdAt) 
              : latest, 
            tppConsents[0].createdAt
          )
        : null
    };
  }).filter(t => t.totalConsents > 0).sort((a, b) => b.activeConsents - a.activeConsents);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Consent Overview</h2>
        <p className="text-slate-600 mt-1">Monitor consent metrics and TPP performance</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Active Consents" 
          value={totalActive} 
          change={12} 
          changeLabel="vs last week"
          icon={CheckCircle}
        />
        <MetricCard 
          title="Expiring Soon" 
          value={totalExpiring} 
          alert={totalExpiring > 0}
          icon={Clock}
        />
        <MetricCard 
          title="Revoked Today" 
          value={revokedToday} 
          change={-5}
          changeLabel="vs yesterday"
          icon={XCircle}
        />
        <MetricCard 
          title="New Today" 
          value={newToday} 
          change={8}
          changeLabel="vs yesterday"
          icon={Activity}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consents by Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Consents by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consent Funnel */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Consent Funnel</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelChartData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {funnelChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Consent Activity (Last 14 Days)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString('en-IE', { month: 'long', day: 'numeric' })}
              />
              <Legend />
              <Line type="monotone" dataKey="created" stroke="#22c55e" strokeWidth={2} name="Created" />
              <Line type="monotone" dataKey="revoked" stroke="#ef4444" strokeWidth={2} name="Revoked" />
              <Line type="monotone" dataKey="expired" stroke="#94a3b8" strokeWidth={2} name="Expired" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TPP Performance Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">TPP Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">TPP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Revoke Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Risk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tppMetrics.map((tpp) => (
                <tr key={tpp.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tpp.logo}</span>
                      <div>
                        <p className="font-medium text-slate-900">{tpp.name}</p>
                        <p className="text-sm text-slate-500">{tpp.ncaRegistration}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded">
                      {tpp.authorizationType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-medium">
                    {tpp.activeConsents}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-900">
                    {formatPercentage(tpp.revocationRate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      tpp.riskScore === 'high' 
                        ? 'bg-red-100 text-red-700' 
                        : tpp.riskScore === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {tpp.riskScore.charAt(0).toUpperCase() + tpp.riskScore.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">
                    {tpp.lastActivity ? formatRelativeTime(tpp.lastActivity) : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts Panel */}
      {expiringSoon.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-amber-900">Alerts</h3>
          </div>
          <div className="space-y-3">
            {expiringSoon.map((consent) => {
              const tpp = getTPPById(consent.tppId);
              const daysLeft = Math.ceil((new Date(consent.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return (
                <div key={consent.id} className="flex items-center justify-between bg-white rounded-lg p-4 border border-amber-200">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{tpp?.logo}</span>
                    <div>
                      <p className="font-medium text-slate-900">{tpp?.name}</p>
                      <p className="text-sm text-slate-500">Consent ID: {consent.id}</p>
                    </div>
                  </div>
                  <span className="text-amber-700 font-medium">Expires in {daysLeft} days</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
