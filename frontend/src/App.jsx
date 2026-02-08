import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import { API_BASE_URL, API_KEY } from './apiConfig';
import './styles/main.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdvisorDashboard from './components/AdvisorDashboard/AdvisorDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        
        {/* New Advisor Route */}
        <Route path="/advisor-dashboard" element={
          <ProtectedRoute role="advisor">
            <AdvisorDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const user = auth.currentUser;
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Check user role from Firebase
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/analytics`, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const tabs = [
    { id: 'chat', label: 'Chat Interface', icon: '💬' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  return (
    <div className="app">
      <header className="header">
        <h1>🤖 Agentic Honeypot System</h1>
        <p>AI-powered scam detection and engagement platform</p>
      </header>

      <nav className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'analytics' && <Analytics data={analytics} />}
      </main>

      <footer className="footer">
        <p>Agentic Honeypot v1.0 • Built for scam intelligence gathering</p>
      </footer>
    </div>
  );
}

export default App;
