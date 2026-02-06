'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TestResult {
  name: string;
  server: 'flask' | 'simple' | 'both';
  status: 'success' | 'error' | 'pending';
  message: string;
  responseTime: number;
  timestamp: string;
  data?: any;
}

interface ServerStatus {
  flask: boolean;
  simple: boolean;
}

export default function ApiTestPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [serverStatus, setServerStatus] = useState<ServerStatus>({ flask: false, simple: false });
  const [activeMode, setActiveMode] = useState<'both' | 'flask' | 'simple'>('both');

  // Available endpoints for both servers
  const endpoints = {
    flask: [
      { name: 'Health Check', path: 'http://localhost:5001/api/health', description: 'Comprehensive health status' },
      { name: 'Server Status', path: 'http://localhost:5001/api/status', description: 'Detailed server metrics' },
      { name: 'Run Test', path: 'http://localhost:5001/api/test?type=advanced&delay=0.5', description: 'Configurable test' },
      { name: 'Get Metrics', path: 'http://localhost:5001/api/metrics', description: 'Performance metrics' },
      { name: 'Simulate Delay', path: 'http://localhost:5001/api/simulation/delay', description: 'Delay simulation' },
    ],
    simple: [
      { name: 'Health Check', path: 'http://localhost:5002/api/health', description: 'Basic health status' },
      { name: 'Quick Test', path: 'http://localhost:5002/api/quick-test', description: 'Fast performance test' },
      { name: 'Ping', path: 'http://localhost:5002/api/ping', description: 'Simple ping/pong' },
      { name: 'Server Info', path: 'http://localhost:5002/api/info', description: 'Server information' },
    ]
  };

  // Check server availability
  const checkServers = async () => {
    const checks = [
      { name: 'flask', url: 'http://localhost:5001/api/health' },
      { name: 'simple', url: 'http://localhost:5002/api/health' }
    ];

    const status: ServerStatus = { flask: false, simple: false };

    for (const check of checks) {
      try {
        const response = await fetch(check.url, { 
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(3000)
        });
        
        if (response.ok) {
          status[check.name as keyof ServerStatus] = true;
        }
      } catch {
        // Server not available
      }
    }

    setServerStatus(status);
    
    // Auto-select mode based on available servers
    if (status.flask && status.simple) setActiveMode('both');
    else if (status.flask) setActiveMode('flask');
    else if (status.simple) setActiveMode('simple');
  };

  // Test a single endpoint
  const testEndpoint = async (endpoint: any, serverType: 'flask' | 'simple') => {
    const startTime = Date.now();
    
    // Add pending result
    const pendingResult: TestResult = {
      name: endpoint.name,
      server: serverType,
      status: 'pending',
      message: 'Testing...',
      responseTime: 0,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setResults(prev => [pendingResult, ...prev]);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(endpoint.path, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        
        const successResult: TestResult = {
          name: endpoint.name,
          server: serverType,
          status: 'success',
          message: `✅ ${response.status} - Success`,
          responseTime,
          timestamp: new Date().toLocaleTimeString(),
          data: data
        };

        setResults(prev => prev.map(r => 
          r.name === endpoint.name && r.server === serverType && r.status === 'pending' 
            ? successResult 
            : r
        ));
      } else {
        const errorResult: TestResult = {
          name: endpoint.name,
          server: serverType,
          status: 'error',
          message: `❌ ${response.status} - ${response.statusText}`,
          responseTime,
          timestamp: new Date().toLocaleTimeString()
        };

        setResults(prev => prev.map(r => 
          r.name === endpoint.name && r.server === serverType && r.status === 'pending' 
            ? errorResult 
            : r
        ));
      }
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      const errorResult: TestResult = {
        name: endpoint.name,
        server: serverType,
        status: 'error',
        message: error.name === 'AbortError' ? '⏱️ Timeout after 10s' : `❌ ${error.message}`,
        responseTime,
        timestamp: new Date().toLocaleTimeString()
      };

      setResults(prev => prev.map(r => 
        r.name === endpoint.name && r.server === serverType && r.status === 'pending' 
          ? errorResult 
          : r
      ));
    }
  };

  // Test all endpoints for active mode
  const testAllEndpoints = async () => {
    setLoading(true);
    setResults([]);
    
    const endpointsToTest = [];
    
    if (activeMode === 'both' || activeMode === 'flask') {
      endpointsToTest.push(...endpoints.flask.map(ep => ({ ...ep, server: 'flask' as const })));
    }
    
    if (activeMode === 'both' || activeMode === 'simple') {
      endpointsToTest.push(...endpoints.simple.map(ep => ({ ...ep, server: 'simple' as const })));
    }
    
    for (const endpoint of endpointsToTest) {
      await testEndpoint(endpoint, endpoint.server);
      await new Promise(resolve => setTimeout(resolve, 800)); // Delay between tests
    }
    
    setLoading(false);
  };

  // Clear results
  const clearResults = () => {
    setResults([]);
  };

  // Get status color
  const getStatusColor = (status: string, server: string) => {
    const base = status === 'success' ? 'border-green-700' :
                 status === 'error' ? 'border-red-700' :
                 'border-yellow-700';
    
    const bg = server === 'flask' ? 'bg-blue-900/20' :
               server === 'simple' ? 'bg-purple-900/20' :
               'bg-gray-800/20';
    
    return `${bg} ${base}`;
  };

  // Get server badge
  const getServerBadge = (server: string) => {
    return server === 'flask' 
      ? <span className="px-2 py-1 text-xs bg-blue-600 rounded">Flask</span>
      : <span className="px-2 py-1 text-xs bg-purple-600 rounded">Simple</span>;
  };

  useEffect(() => {
    checkServers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">🛡️ Dual API Testing System</h1>
              <p className="text-gray-400">Test both Flask and Simple HTTP APIs simultaneously</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                ← Dashboard
              </Link>
            </div>
          </div>

          {/* Server Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-xl border ${serverStatus.flask ? 'border-green-600 bg-green-900/20' : 'border-red-600 bg-red-900/20'}`}>
              <h3 className="font-bold mb-2">🚀 Flask API</h3>
              <p className={serverStatus.flask ? 'text-green-400' : 'text-red-400'}>
                {serverStatus.flask ? '✅ Running on port 5001' : '❌ Not available'}
              </p>
              <p className="text-sm text-gray-400 mt-2">Feature-rich API with simulations</p>
            </div>
            
            <div className={`p-4 rounded-xl border ${serverStatus.simple ? 'border-green-600 bg-green-900/20' : 'border-red-600 bg-red-900/20'}`}>
              <h3 className="font-bold mb-2">⚡ Simple API</h3>
              <p className={serverStatus.simple ? 'text-green-400' : 'text-red-400'}>
                {serverStatus.simple ? '✅ Running on port 5002' : '❌ Not available'}
              </p>
              <p className="text-sm text-gray-400 mt-2">Zero-dependency lightweight API</p>
            </div>
            
            <div className="p-4 rounded-xl border border-blue-600 bg-blue-900/20">
              <h3 className="font-bold mb-2">🎯 Testing Mode</h3>
              <div className="flex gap-2 mt-2">
                {['both', 'flask', 'simple'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveMode(mode as any)}
                    className={`px-3 py-1 rounded text-sm ${
                      activeMode === mode 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {mode === 'both' ? 'Both' : mode === 'flask' ? 'Flask' : 'Simple'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={testAllEndpoints}
              disabled={loading || (!serverStatus.flask && !serverStatus.simple)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
            >
              {loading ? '🔄 Testing...' : '🧪 Run All Tests'}
            </button>
            
            <button
              onClick={clearResults}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              🗑️ Clear Results
            </button>
            
            <button
              onClick={checkServers}
              className="px-6 py-3 bg-green-800 hover:bg-green-700 rounded-lg transition-colors"
            >
              🔄 Check Servers
            </button>
          </div>

          {/* Individual Endpoints */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Test Individual Endpoints</h3>
            
            {/* Flask Endpoints */}
            {(activeMode === 'both' || activeMode === 'flask') && serverStatus.flask && (
              <div className="mb-6">
                <h4 className="text-lg font-medium text-blue-400 mb-3">🚀 Flask API Endpoints</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {endpoints.flask.map((endpoint, idx) => (
                    <button
                      key={`flask-${idx}`}
                      onClick={() => testEndpoint(endpoint, 'flask')}
                      disabled={loading}
                      className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg hover:bg-blue-900/30 transition-colors text-left disabled:opacity-50"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{endpoint.name}</span>
                        <span className="text-xs px-2 py-1 bg-blue-700 rounded">Flask</span>
                      </div>
                      <p className="text-sm text-gray-300">{endpoint.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Simple Endpoints */}
            {(activeMode === 'both' || activeMode === 'simple') && serverStatus.simple && (
              <div>
                <h4 className="text-lg font-medium text-purple-400 mb-3">⚡ Simple API Endpoints</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {endpoints.simple.map((endpoint, idx) => (
                    <button
                      key={`simple-${idx}`}
                      onClick={() => testEndpoint(endpoint, 'simple')}
                      disabled={loading}
                      className="p-4 bg-purple-900/20 border border-purple-800 rounded-lg hover:bg-purple-900/30 transition-colors text-left disabled:opacity-50"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{endpoint.name}</span>
                        <span className="text-xs px-2 py-1 bg-purple-700 rounded">Simple</span>
                      </div>
                      <p className="text-sm text-gray-300">{endpoint.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Test Results</h2>
            <span className="text-gray-400 text-sm">
              {results.length} test{results.length !== 1 ? 's' : ''} • {
                results.filter(r => r.status === 'success').length
              } successful
            </span>
          </div>

          {results.length === 0 ? (
            <div className="bg-gray-800/20 border border-gray-700 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gray-400">No tests have been run yet.</p>
              <p className="text-gray-500 text-sm mt-2">Select endpoints and run tests to see results.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${getStatusColor(result.status, result.server)}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getServerBadge(result.server)}
                        <span className="font-medium">{result.name}</span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          result.status === 'success' ? 'bg-green-700' :
                          result.status === 'error' ? 'bg-red-700' :
                          'bg-yellow-700'
                        }`}>
                          {result.status === 'success' ? '✅' :
                           result.status === 'error' ? '❌' : '⏳'}
                        </span>
                        <span className="text-gray-400 text-sm">{result.responseTime}ms</span>
                      </div>
                      <p className="text-gray-300">{result.message}</p>
                      {result.data && (
                        <details className="mt-3">
                          <summary className="text-gray-400 text-sm cursor-pointer hover:text-gray-300">
                            View Response Data
                          </summary>
                          <pre className="mt-2 p-3 bg-black/30 rounded-lg overflow-x-auto text-xs">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                    <span className="text-gray-500 text-sm">{result.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Test Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/20 border border-gray-700 rounded-xl p-4">
              <div className="text-2xl font-bold">{results.length}</div>
              <div className="text-sm text-gray-400">Total Tests</div>
            </div>
            <div className="bg-green-900/20 border border-green-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">
                {results.filter(r => r.status === 'success').length}
              </div>
              <div className="text-sm text-gray-400">Successful</div>
            </div>
            <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-400">
                {results.filter(r => r.server === 'flask').length}
              </div>
              <div className="text-sm text-gray-400">Flask Tests</div>
            </div>
            <div className="bg-purple-900/20 border border-purple-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-400">
                {results.filter(r => r.server === 'simple').length}
              </div>
              <div className="text-sm text-gray-400">Simple Tests</div>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">📊 API Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2">Feature</th>
                  <th className="text-left py-2 text-blue-400">Flask API</th>
                  <th className="text-left py-2 text-purple-400">Simple API</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-2">Dependencies</td>
                  <td className="py-2">Flask, Flask-CORS</td>
                  <td className="py-2">None (built-in Python)</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2">Startup Time</td>
                  <td className="py-2">~2-3 seconds</td>
                  <td className="py-2">Instant</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2">Features</td>
                  <td className="py-2">Advanced simulations, metrics, configurable tests</td>
                  <td className="py-2">Basic health checks, quick tests</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2">Best For</td>
                  <td className="py-2">Comprehensive API testing, simulations</td>
                  <td className="py-2">Quick checks, no-install scenarios</td>
                </tr>
                <tr>
                  <td className="py-2">Port</td>
                  <td className="py-2">5001</td>
                  <td className="py-2">5002</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white">Running tests on {activeMode} mode...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}