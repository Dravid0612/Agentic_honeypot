'use client';

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 border border-blue-800 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">System Status</p>
            <p className="text-2xl font-bold text-white">Operational</p>
          </div>
          <div className="text-green-400">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
        <p className="text-green-400 text-sm mt-2">All systems normal</p>
      </div>

      <div className="bg-gradient-to-r from-green-900/30 to-emerald-800/20 border border-green-800 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Avg Response Time</p>
            <p className="text-2xl font-bold text-white">87ms</p>
          </div>
          <div className="text-green-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <p className="text-green-400 text-sm mt-2">Optimal performance</p>
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/20 border border-purple-800 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Uptime</p>
            <p className="text-2xl font-bold text-white">99.9%</p>
          </div>
          <div className="text-purple-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p className="text-purple-400 text-sm mt-2">Last 30 days</p>
      </div>

      <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-800 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Security Level</p>
            <p className="text-2xl font-bold text-white">High</p>
          </div>
          <div className="text-red-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <p className="text-red-400 text-sm mt-2">Maximum protection</p>
      </div>
    </div>
  );
}