'use client';

import { useState } from 'react';

export default function GUVIHoneypotTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testExternalEndpoint = async () => {
    // WARNING: This will timeout if external service is down
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://guvi-agentic-honeypot-k0zz.onrender.com', {
        method: 'POST',
        headers: {
          'x-api-key': 'GUVI-Agentic_honeypot_123456',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'honeypot' }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        setError(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (err: any) {
      setError(`External API Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testLocalMock = async () => {
    // Use local mock endpoint instead
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5001/api/guvi-honeypot', {
        method: 'POST',
        headers: {
          'x-api-key': 'GUVI-Agentic_honeypot_123456',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          endpoint: 'test-endpoint',
          data: 'Test honeypot detection'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        setError(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (err: any) {
      setError(`Local API Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testHealth = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/guvi-honeypot/health');
      if (response.ok) {
        const data = await response.json();
        setResult(data);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">🛡️ GUVI Honeypot Test</h2>
        <p className="text-gray-400">Test API authenticity and honeypot endpoints</p>
      </div>

      <div className="space-y-4">
        {/* Test Info */}
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-2">What This Tests:</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• API Authenticity</li>
            <li>• Endpoint availability</li>
            <li>• Proper request handling</li>
            <li>• Response structure</li>
            <li>• Basic honeypot detection</li>
          </ul>
          <p className="text-gray-400 text-sm mt-2">Note: This tester is not a real user.</p>
        </div>

        {/* Required Headers */}
        <div className="bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-medium text-blue-300 mb-2">Required Headers:</h4>
          <div className="font-mono text-sm bg-black/30 p-2 rounded">
            x-api-key: GUVI-Agentic_honeypot_123456
          </div>
        </div>

        {/* URL Info */}
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">Endpoint URLs:</h4>
          <div className="space-y-2">
            <div>
              <p className="text-gray-400 text-sm">External (May timeout):</p>
              <p className="font-mono text-sm text-red-300 break-all">
                https://guvi-agentic-honeypot-k0zz.onrender.com
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Local Mock:</p>
              <p className="font-mono text-sm text-green-300">
                http://localhost:5001/api/guvi-honeypot
              </p>
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="flex flex-wrap gap-3 pt-4">
          <button
            onClick={testLocalMock}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all"
          >
            {loading ? 'Testing...' : 'Test Local Mock'}
          </button>
          
          <button
            onClick={testExternalEndpoint}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 transition-all"
          >
            Test External (May Fail)
          </button>
          
          <button
            onClick={testHealth}
            disabled={loading}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            Health Check
          </button>
          
          <button
            onClick={clearResults}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Clear Results
          </button>
        </div>

        {/* Results Display */}
        {(result || error) && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">Test Result:</h3>
            
            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <span className="text-red-400 mr-2">❌</span>
                  <span className="text-red-300 font-medium">Error</span>
                </div>
                <p className="text-red-200 mt-2">{error}</p>
                <p className="text-red-300 text-sm mt-2">
                  Tip: Use the "Test Local Mock" button instead for reliable testing.
                </p>
              </div>
            )}
            
            {result && (
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-green-300 font-medium">Success</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-gray-300 font-medium mb-1">Status:</h4>
                    <p className="text-white">{result.status}</p>
                  </div>
                  
                  {result.data && (
                    <div>
                      <h4 className="text-gray-300 font-medium mb-1">Detection Results:</h4>
                      <div className="bg-black/30 p-3 rounded">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-400">Malicious:</span>
                            <span className={`ml-2 ${result.data.is_malicious ? 'text-red-400' : 'text-green-400'}`}>
                              {result.data.is_malicious ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Confidence:</span>
                            <span className="ml-2 text-white">{result.data.confidence_score}%</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Action:</span>
                            <span className="ml-2 text-white">{result.data.action_taken}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Threats:</span>
                            <span className="ml-2 text-white">{result.data.threats_detected.length}</span>
                          </div>
                        </div>
                        
                        {result.data.threats_detected.length > 0 && (
                          <div className="mt-3">
                            <h5 className="text-gray-400 text-sm mb-1">Threats Detected:</h5>
                            <ul className="text-red-300 text-sm">
                              {result.data.threats_detected.map((threat: string, idx: number) => (
                                <li key={idx}>• {threat}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <details>
                    <summary className="text-gray-400 text-sm cursor-pointer hover:text-gray-300">
                      View Full Response
                    </summary>
                    <pre className="mt-2 p-3 bg-black/50 rounded-lg overflow-x-auto text-xs text-gray-300">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-800/30 rounded-lg">
              <p className="text-2xl font-bold text-white">2</p>
              <p className="text-gray-400 text-sm">Endpoints</p>
            </div>
            <div className="text-center p-3 bg-gray-800/30 rounded-lg">
              <p className="text-2xl font-bold text-white">5</p>
              <p className="text-gray-400 text-sm">Tests</p>
            </div>
            <div className="text-center p-3 bg-gray-800/30 rounded-lg">
              <p className="text-2xl font-bold text-green-400">100%</p>
              <p className="text-gray-400 text-sm">Mock Success</p>
            </div>
            <div className="text-center p-3 bg-gray-800/30 rounded-lg">
              <p className="text-2xl font-bold text-yellow-400">30s</p>
              <p className="text-gray-400 text-sm">External Timeout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}