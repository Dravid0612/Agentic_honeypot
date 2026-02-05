'use client'

import { useState, useEffect } from 'react'
import ScamDetector from '@/components/ScamDetector'
import Dashboard from '@/components/Dashboard'
import Analytics from '@/components/Analytics'
import axios from 'axios'

export default function Home() {
  const [activeTab, setActiveTab] = useState('detect')
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking')
  const [stats, setStats] = useState({
    totalDetections: 0,
    scamsFound: 0,
    accuracy: 0,
    responseTime: 0
  })

  useEffect(() => {
    checkBackendStatus()
    fetchStats()
  }, [])

  const checkBackendStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8000/health', {
        timeout: 5000
      })
      setBackendStatus(response.data.status === 'healthy' ? 'online' : 'offline')
    } catch (error) {
      setBackendStatus('offline')
    }
  }

  const fetchStats = async () => {
    try {
      // Mock stats for now - replace with actual API call
      setStats({
        totalDetections: 1247,
        scamsFound: 892,
        accuracy: 94.5,
        responseTime: 0.8
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/30">
          <span className="text-sm font-medium gradient-text">AI-Powered Security Platform</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span className="gradient-text">Agentic Honeypot</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
          Advanced scam detection and intelligence gathering platform using cutting-edge AI to analyze and engage with fraudulent activities in real-time.
        </p>
        
        {/* Status Bar */}
        <div className="glass-card max-w-2xl mx-auto p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${backendStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <div>
                <p className="font-medium text-gray-200">API Status</p>
                <p className="text-sm text-gray-400">
                  {backendStatus === 'online' ? 'Connected to backend server' : 
                   backendStatus === 'offline' ? 'Backend server offline' : 'Checking connection...'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{stats.totalDetections.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Total Scans</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{stats.accuracy}%</p>
                <p className="text-sm text-gray-400">Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">{stats.responseTime}s</p>
                <p className="text-sm text-gray-400">Avg Response</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation - Modern Design */}
      <div className="glass-card p-2 mb-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <button
            onClick={() => setActiveTab('detect')}
            className={`flex-1 py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
              activeTab === 'detect' 
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30' 
                : 'hover:bg-gray-800/50'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === 'detect' ? 'bg-blue-500' : 'bg-gray-700'}`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-left">
              <p className={`font-semibold ${activeTab === 'detect' ? 'text-white' : 'text-gray-400'}`}>
                Scam Detection
              </p>
              <p className="text-sm text-gray-500">Real-time message analysis</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
              activeTab === 'dashboard' 
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30' 
                : 'hover:bg-gray-800/50'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-purple-500' : 'bg-gray-700'}`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-left">
              <p className={`font-semibold ${activeTab === 'dashboard' ? 'text-white' : 'text-gray-400'}`}>
                Dashboard
              </p>
              <p className="text-sm text-gray-500">System overview & metrics</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
              activeTab === 'analytics' 
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30' 
                : 'hover:bg-gray-800/50'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === 'analytics' ? 'bg-green-500' : 'bg-gray-700'}`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <div className="text-left">
              <p className={`font-semibold ${activeTab === 'analytics' ? 'text-white' : 'text-gray-400'}`}>
                Analytics
              </p>
              <p className="text-sm text-gray-500">Detailed insights & reports</p>
            </div>
          </button>
        </div>
      </div>

      {/* API Request/Response Preview */}
      <div className="glass-card max-w-4xl mx-auto p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          API Request Format
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="bg-gray-900 rounded-lg p-4 mb-2">
              <div className="text-sm text-gray-400 mb-2">Input (JSON):</div>
              <pre className="text-sm text-green-400 overflow-x-auto">
{`{
  "text": "Your UPI account is blocked...",
  "sessionId": "optional_123",
  "metadata": {
    "source": "whatsapp"
  }
}`}</pre>
            </div>
            <p className="text-sm text-gray-400">Send POST request to: <code className="bg-gray-800 px-2 py-1 rounded">/api/v1/process</code></p>
          </div>
          <div>
            <div className="bg-gray-900 rounded-lg p-4 mb-2">
              <div className="text-sm text-gray-400 mb-2">Output (JSON):</div>
              <pre className="text-sm text-yellow-400 overflow-x-auto">
{`{
  "status": "success",
  "detection": {
    "is_scam": true,
    "confidence": 0.92,
    "scam_type": "UPI_FRAUD"
  },
  "response": "Agent response here...",
  "session_state": {...}
}`}</pre>
            </div>
            <p className="text-sm text-gray-400">Response time: ~{stats.responseTime} seconds</p>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto">
        {activeTab === 'detect' && <ScamDetector />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'analytics' && <Analytics />}
      </div>
    </div>
  )
}