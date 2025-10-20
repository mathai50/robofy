'use client';

import React, { useState, useEffect } from 'react';
import conversationStore from '@/lib/conversation-store';

interface DashboardStats {
  totalSessions: number;
  activeSessions: number;
  sessionsWithLeads: number;
  averageLeadScore: number;
  recentLeads: Array<{
    sessionId: string;
    leadScore: number;
    industry?: string;
    createdAt: Date;
    leadCreated: boolean;
  }>;
}

export default function AIChatDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  useEffect(() => {
    fetchStats();

    const interval = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Get basic stats from conversation store
      const basicStats = conversationStore.getStats();

      // Get active sessions for detailed view
      const activeSessions = conversationStore.getActiveSessions();

      // Calculate recent leads (sessions with leadCreated flag)
      const sessionsWithLeads = activeSessions.filter(session => session.leadCreated);
      const recentLeads = sessionsWithLeads
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, 10)
        .map(session => ({
          sessionId: session.sessionId,
          leadScore: session.context.leadScore,
          industry: session.context.industry,
          createdAt: session.updatedAt,
          leadCreated: session.leadCreated || false
        }));

      setStats({
        totalSessions: basicStats.totalSessions,
        activeSessions: basicStats.activeSessions,
        sessionsWithLeads: basicStats.sessionsWithLeads,
        averageLeadScore: basicStats.averageLeadScore,
        recentLeads
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading && !stats) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">AI Chat Dashboard</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchStats}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-300 rounded"
          >
            <option value={10000}>10s</option>
            <option value={30000}>30s</option>
            <option value={60000}>1m</option>
            <option value={300000}>5m</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats?.totalSessions || 0}</div>
          <div className="text-sm text-blue-800">Total Sessions</div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats?.activeSessions || 0}</div>
          <div className="text-sm text-green-800">Active Sessions</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{stats?.sessionsWithLeads || 0}</div>
          <div className="text-sm text-purple-800">Leads Generated</div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{stats?.averageLeadScore || 0}</div>
          <div className="text-sm text-orange-800">Avg Lead Score</div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Leads</h3>

        {(!stats?.recentLeads || stats.recentLeads.length === 0) ? (
          <div className="text-center py-8 text-gray-500">
            No recent leads to display
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentLeads.map((lead) => (
              <div key={lead.sessionId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(lead.leadScore)}`}>
                      Score: {lead.leadScore}
                    </span>
                    {lead.industry && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {lead.industry}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Session: {lead.sessionId.slice(-8)}
                  </div>
                </div>

                <div className="text-right text-sm text-gray-600">
                  <div>{formatDate(lead.createdAt)}</div>
                  <div>{formatTime(lead.createdAt)}</div>
                </div>

                <div className="ml-4">
                  {lead.leadCreated ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Lead Created
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Health */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-600">AI Service: Operational</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Conversation Store: Active</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Lead Processing: Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}