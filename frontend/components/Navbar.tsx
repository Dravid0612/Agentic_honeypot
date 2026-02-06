'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-white">🛡️ Agentic Honeypot</h1>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <a href="/" className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </a>
                <a href="/api-test" className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium">
                  API Test
                </a>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            v1.0.0
          </div>
        </div>
      </div>
    </nav>
  );
}
  