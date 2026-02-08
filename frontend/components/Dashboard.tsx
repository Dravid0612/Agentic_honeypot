'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRequests: 1245,
    threatsBlocked: 42,
    successRate: 98.7,
    activeSessions: 23
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 10),
        activeSessions: Math.max(5, Math.min(50, prev.activeSessions + Math.floor(Math.random() * 3) - 1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">📊 Dashboard Overview</h2>
        <p className="text-gray-400">Real-time monitoring and metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Requests</p>
              <p className="text-2xl font-bold text-white">{stats.totalRequests.toLocaleString()}</p>
            </div>
            <div className="text-green-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-green-400 text-sm mt-2 flex items-center">
            <span>+12.5% from last week</span>
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Threats Blocked</p>
              <p className="text-2xl font-bold text-white">{stats.threatsBlocked}</p>
            </div>
            <div className="text-red-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <p className="text-red-400 text-sm mt-2">↓ 8.2% from last week</p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-white">{stats.successRate}%</p>
            </div>
            <div className="text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-blue-400 text-sm mt-2">↑ 1.3% from last week</p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Sessions</p>
              <p className="text-2xl font-bold text-white">{stats.activeSessions}</p>
            </div>
            <div className="text-purple-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-purple-400 text-sm mt-2">Currently active</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Recent Activity</h3>
          <span className="text-sm text-gray-500">Updated just now</span>
        </div>
        
        <div className="space-y-3">
          {[
            { id: 1, type: 'API Request', status: 'success', time: '2 min ago', user: 'User: NY' },
            { id: 2, type: 'Threat Scan', status: 'warning', time: '5 min ago', user: 'System' },
            { id: 3, type: 'Login Attempt', status: 'danger', time: '10 min ago', user: 'IP: 192.168.1.100' },
            { id: 4, type: 'Data Backup', status: 'success', time: '15 min ago', user: 'System' },
            { id: 5, type: 'API Test', status: 'success', time: '20 min ago', user: 'Admin' },
          ].map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <div>
                  <p className="text-gray-300">{activity.type}</p>
                  <p className="text-gray-500 text-sm">{activity.user}</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}