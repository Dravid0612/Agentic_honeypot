'use client'

import { useState } from 'react'
import axios from 'axios'

interface DetectionResult {
  isScam: boolean
  confidence: number
  scamType: string
  keywords_found?: string[]
  score?: number
}

export default function ScamDetector() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showJson, setShowJson] = useState(false)

  const detectScam = async () => {
    if (!text.trim()) {
      setError('Please enter some text')
      return
    }

    setLoading(true)
    setError('')
    setShowJson(false)
    
    try {
      // Show API request format
      console.log('Sending request:', { text })
      
      const response = await axios.post('http://localhost:8000/detect', {
        text: text
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Received response:', response.data)
      setResult(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to detect scam. Make sure backend is running on port 8000.')
      console.error('Detection error:', err)
    } finally {
      setLoading(false)
    }
  }

  const exampleTexts = [
    {
      text: "URGENT: Your bank account has been blocked. Click here to verify your details immediately: https://fake-bank-verify.com",
      type: "Phishing"
    },
    {
      text: "Congratulations! You've won ₹10,00,000 in our lottery. Send ₹500 processing fee to claim your prize.",
      type: "Lottery Scam"
    },
    {
      text: "Your UPI ID will be suspended in 2 hours. Update your KYC now by sharing OTP: 987654",
      type: "UPI Fraud"
    },
    {
      text: "Hello, I'm from Microsoft support. Your computer has virus. Call us immediately at 1800-xxx-xxx.",
      type: "Tech Support"
    }
  ]

  const loadExample = (exampleText: string) => {
    setText(exampleText)
    setResult(null)
    setError('')
  }

  const clearForm = () => {
    setText('')
    setResult(null)
    setError('')
    setShowJson(false)
  }

  return (
    <div className="space-y-8">
      {/* Main Detection Card */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Real-time Scam Detection</h2>
            <p className="text-gray-400">Analyze suspicious messages with advanced AI algorithms</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">AI Model Active</span>
          </div>
        </div>

        {/* Input Area */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="message" className="block text-sm font-medium text-gray-300">
              Enter Suspicious Message
            </label>
            <span className="text-sm text-gray-500">{text.length}/2000 characters</span>
          </div>
          <textarea
            id="message"
            rows={6}
            className="input-field"
            placeholder="Paste or type a suspicious message here for analysis..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Example Messages */}
        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-3">Try example messages:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exampleTexts.map((example, index) => (
              <button
                key={index}
                onClick={() => loadExample(example.text)}
                className="p-3 text-left rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-300 group-hover:text-white line-clamp-2">{example.text}</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-900 rounded text-gray-400">
                      {example.type}
                    </span>
                  </div>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-400 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={detectScam}
            disabled={loading || !text.trim()}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Analyzing with AI...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Detect Scam
              </span>
            )}
          </button>
          
          <button
            onClick={clearForm}
            className="btn-secondary"
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </span>
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div className={`glass-card p-8 ${result.isScam ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${result.isScam ? 'bg-red-900/30' : 'bg-green-900/30'}`}>
                {result.isScam ? (
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Analysis Results</h3>
                <p className="text-gray-400">AI-powered scam detection completed</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowJson(!showJson)}
              className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span>{showJson ? 'Hide JSON' : 'Show JSON'}</span>
            </button>
          </div>

          {showJson ? (
            <div className="bg-gray-900 rounded-lg p-4 mb-6">
              <pre className="text-sm text-green-400 overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Main Results */}
              <div>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-300">Detection Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      result.isScam 
                        ? 'bg-red-900/40 text-red-300 border border-red-800' 
                        : 'bg-green-900/40 text-green-300 border border-green-800'
                    }`}>
                      {result.isScam ? '⚠️ SCAM DETECTED' : '✅ LEGITIMATE'}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Confidence Level</span>
                      <span className="text-white font-semibold">{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          result.confidence > 0.7 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 
                          result.confidence > 0.4 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 
                          'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-400">Scam Type</span>
                      <span className="font-medium text-white">{result.scamType}</span>
                    </div>
                    
                    {result.score !== undefined && (
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-400">Risk Score</span>
                        <span className="font-medium text-white">{result.score}/10</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Keywords & Actions */}
              <div>
                {result.keywords_found && result.keywords_found.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Suspicious Keywords Found</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords_found.map((keyword, index) => (
                        <span 
                          key={index}
                          className="px-3 py-2 bg-red-900/30 text-red-300 rounded-lg border border-red-800/50 text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.isScam && (
                  <div className="p-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-800/30 rounded-lg">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-red-300 mb-2">Security Warning</h4>
                        <ul className="text-sm text-red-200/80 space-y-1">
                          <li>• Do not share personal information or OTP</li>
                          <li>• Do not click on any links in the message</li>
                          <li>• Do not send money or make payments</li>
                          <li>• Report this to authorities if needed</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-800">
            <button className="px-4 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 rounded-lg border border-blue-800/50 transition-colors flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Save Report</span>
            </button>
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-700 transition-colors flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export as JSON</span>
            </button>
            <button className="px-4 py-2 bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 rounded-lg border border-purple-800/50 transition-colors flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}