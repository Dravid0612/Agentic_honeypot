import Dashboard from '../components/Dashboard'
import Analytics from '../components/Analytics'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Agentic Honeypot Dashboard</h1>
          <p className="text-gray-400">Real-time monitoring and threat detection system</p>
          
          {/* Navigation */}
          <div className="mt-6 flex space-x-4">
            <a 
              href="/" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Dashboard
            </a>
            <a 
              href="/api-test" 
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              API Test
            </a>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Total Requests</h3>
            <p className="text-3xl font-bold text-white">1,234</p>
            <p className="text-sm text-green-400 mt-2">↑ 12.5% from last week</p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Threats Detected</h3>
            <p className="text-3xl font-bold text-white">42</p>
            <p className="text-sm text-red-400 mt-2">↓ 8.2% from last week</p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Success Rate</h3>
            <p className="text-3xl font-bold text-white">98.7%</p>
            <p className="text-sm text-green-400 mt-2">↑ 1.3% from last week</p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Dashboard />
          <Analytics />
        </div>
      </div>
    </main>
  )
}