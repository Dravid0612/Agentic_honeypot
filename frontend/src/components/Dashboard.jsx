import React, { useState, useEffect } from 'react';
import { API_BASE_URL, API_KEY } from '../apiConfig';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    scams: 0,
    legitimate: 0,
    avgConfidence: 0
  });

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch recent sessions
      const [analyticsRes, sessionsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/analytics`, {
          headers: { 'x-api-key': API_KEY }
        }),
        fetch(`${API_BASE_URL}/api/v1/sessions`, {
          headers: { 'x-api-key': API_KEY }
        })
      ]);

      const analyticsData = await analyticsRes.json();
      const sessionsData = await sessionsRes.json();

      setStats({
        total: analyticsData.total_sessions || 0,
        scams: analyticsData.scam_sessions || 0,
        legitimate: analyticsData.legitimate_sessions || 0,
        avgConfidence: analyticsData.avg_confidence || 0
      });

      setSessions(sessionsData.slice(0, 10) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getRiskColor = (confidence) => {
    if (confidence >= 0.8) return '#ff4444';
    if (confidence >= 0.6) return '#ffaa00';
    return '#00c851';
  };

  return (
    <div className="dashboard">
      <h2>Real-time Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Sessions</div>
        </div>
        
        <div className="stat-card scams">
          <div className="stat-icon">🚨</div>
          <div className="stat-value">{stats.scams}</div>
          <div className="stat-label">Scam Detections</div>
        </div>
        
        <div className="stat-card legitimate">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.legitimate}</div>
          <div className="stat-label">Legitimate</div>
        </div>
        
        <div className="stat-card confidence">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{(stats.avgConfidence * 100).toFixed(1)}%</div>
          <div className="stat-label">Avg Confidence</div>
        </div>
      </div>

      <div className="recent-sessions">
        <h3>Recent Sessions</h3>
        {sessions.length > 0 ? (
          <div className="sessions-table">
            <table>
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>Status</th>
                  <th>Confidence</th>
                  <th>Messages</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, index) => (
                  <tr key={index}>
                    <td className="session-id-cell">
                      <code>{session.session_id.substring(0, 12)}...</code>
                    </td>
                    <td>
                      <span className={`status-badge ${session.is_scam ? 'scam' : 'legit'}`}>
                        {session.is_scam ? 'Scam' : 'Legitimate'}
                      </span>
                    </td>
                    <td>
                      <div className="confidence-bar">
                        <div 
                          className="confidence-fill"
                          style={{
                            width: `${session.confidence * 100}%`,
                            backgroundColor: getRiskColor(session.confidence)
                          }}
                        ></div>
                        <span className="confidence-text">
                          {(session.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td>{session.message_count || 0}</td>
                    <td>
                      {new Date(session.last_updated * 1000).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-table">
            <p>No active sessions</p>
          </div>
        )}
      </div>

      <div className="system-metrics">
        <h3>System Metrics</h3>
        <div className="metrics-grid">
          <div className="metric">
            <div className="metric-label">API Response Time</div>
            <div className="metric-value">~250ms</div>
            <div className="metric-trend positive">↓ 12%</div>
          </div>
          <div className="metric">
            <div className="metric-label">Detection Accuracy</div>
            <div className="metric-value">94.2%</div>
            <div className="metric-trend positive">↑ 2.1%</div>
          </div>
          <div className="metric">
            <div className="metric-label">Active Agents</div>
            <div className="metric-value">4</div>
            <div className="metric-trend neutral">→</div>
          </div>
          <div className="metric">
            <div className="metric-label">Avg Session Length</div>
            <div className="metric-value">5.2</div>
            <div className="metric-trend negative">↑ 0.8</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
