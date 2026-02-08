import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import ScamDetector from './components/ScamDetector';
import GUVIHoneypotTest from './components/GUVIHoneypotTest';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">🛡️ Agentic Honeypot Dashboard</h1>
            <p className="text-gray-400">Real-time threat detection and API security monitoring</p>
          </div>

          {/* Stats Overview */}
          <StatsOverview />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <ScamDetector />
            </div>
            <div>
              <Dashboard />
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Analytics />
            <GUVIHoneypotTest />
          </div>

          {/* Quick Actions */}
          <div className="mt-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">🚀 Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <a href="/api-test" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Test All APIs
              </a>
              <a href="/docs" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                View Documentation
              </a>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                Generate Report
              </button>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                Emergency Lockdown
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}