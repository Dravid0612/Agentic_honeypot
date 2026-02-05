'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface Session {
  session_id: string
  is_scam: boolean
  confidence: number
  message_count: number
  last_updated: number
  scam_type?: string
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']

export default function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [stats, setStats] = useState({
    total: 0,
    scams: 0,
    legitimate: 0,
    scamRate: 0,
    avgMessages: 0,
    avgResponseTime: 1.2
  })

  const [chartData, setChartData] = useState([
    { day: 'Mon', scams: 42, legitimate: 18 },
    { day: 'Tue', scams: 38, legitimate: 22 },
    { day: 'Wed', scams: 51, legitimate: 15 },
    { day: 'Thu', scams: 47, legitimate: 19 },
    { day: 'Fri', scams: 63, legitimate: 24 },
    { day: 'Sat', scams: 55, legitimate: 28 },
    { day: 'Sun', scams: 48, legitimate: 21 }
  ])

  const [scamTypes, setScamTypes] = useState([
    { name: 'UPI Fraud', value: 45, color: '#3b82f6' },
    { name: 'Phishing', value: 25, color: '#ef4444' },
    { name: 'Investment', value: 15, color: '#10b981' },
    { name: 'Tech Support', value: 10, color: '#f59e0b' },
    { name: 'Romance', value: 5, color: '#8b5cf6' }
  ])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Mock data for now - replace with actual API calls
      const mockSessions: Session[] = Array.from({ length: 8 }, (_, i) => ({
        session_id: `sess_${1000 + i}`,
        is_scam: Math.random() > 0.3,
        confidence: Math.random() * 0.5 + 0.5,
        message_count: Math.floor(Math.random() * 20) + 1,
        last_updated: Date.now() / 1000 - i * 3600,
        scam_type: ['UPI Fraud', 'Phishing', 'Investment Scam', 'Tech Support'][Math.floor(Math.random() * 4)]
      }))

      const scamCount = mockSessions.filter(s => s.is_scam).length
      
      setSessions(mockSessions)
      setStats({
        total: mockSessions.length,
        scams: scamCount,
        legitimate: mockSessions.length - scamCount,
        scamRate: (scamCount / mockSessions.length) * 100,
        avgMessages: 8.2,
        avgResponseTime: 1.2
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const formatTime = (timestamp: number) => {
    const now = Date.now() / 1000
    const diff = now - timestamp
    
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const refreshData = () => {
    fetchDashboardData()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">System Dashboard</h2>
            <p className="text-gray-400">Real-time monitoring and performance metrics</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 rounded-lg border border-blue-800/50 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Sessions</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.total.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-900/30 rounded-xl">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-400">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>+12.5% from last week</span>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Scams Detected</p>
              <p className="text-3xl font-bold text-red-400 mt-2">{stats.scams.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-900/30 rounded-xl">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Scam Rate</span>
              <span className="font-semibold text-white">{stats.scamRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                style={{ width: `${stats.scamRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Response Time</p>
              <p className="text-3xl font-bold text-green-400 mt-2">{stats.avgResponseTime}s</p>
            </div>
            <div className="p-3 bg-green-900/30 rounded-xl">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-400">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>25% faster than last month</span>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Messages/Session</p>
              <p className="text-3xl font-bold text-purple-400 mt-2">{stats.avgMessages}</p>
            </div>
            <div className="p-3 bg-purple-900/30 rounded-xl">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-gray-400">Engagement Level:</span>
              <span className="ml-2 font-semibold text-yellow-400">High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Weekly Activity Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', color: 'white' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="scams" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ stroke: '#ef4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="legitimate" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ stroke: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scam Type Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Scam Type Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scamTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {scamTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', color: 'white' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Recent Activity Sessions</h3>
            <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading sessions...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Session ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Messages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {sessions.map((session) => (
                  <tr key={session.session_id} className="hover:bg-gray-900/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{session.session_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        session.is_scam 
                          ? 'bg-red-900/40 text-red-300 border border-red-800' 
                          : 'bg-green-900/40 text-green-300 border border-green-800'
                      }`}>
                        {session.is_scam ? 'Scam' : 'Legitimate'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-800 rounded-full h-2 mr-3">
                          <div 
                            className={`h-2 rounded-full ${
                              session.confidence > 0.7 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 
                              session.confidence > 0.4 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 
                              'bg-gradient-to-r from-green-500 to-emerald-500'
                            }`}
                            style={{ width: `${session.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-300">
                          {(session.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{session.message_count}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{session.scam_type || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {formatTime(session.last_updated)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}