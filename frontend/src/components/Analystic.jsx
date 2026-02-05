import React from 'react';

const Analytics = ({ data }) => {
  if (!data) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  const scamRate = data.scam_rate || 0;
  const totalSessions = data.total_sessions || 0;
  const scamSessions = data.scam_sessions || 0;

  return (
    <div className="analytics">
      <h2>Analytics & Insights</h2>
      
      <div className="analytics-header">
        <div className="overview-card">
          <h3>Overview</h3>
          <div className="overview-stats">
            <div className="overview-stat">
              <div className="stat-value">{totalSessions}</div>
              <div className="stat-label">Total Conversations</div>
            </div>
            <div className="overview-stat">
              <div className="stat-value">{scamSessions}</div>
              <div className="stat-label">Scam Attempts</div>
            </div>
            <div className="overview-stat">
              <div className="stat-value">{(scamRate * 100).toFixed(1)}%</div>
              <div className="stat-label">Scam Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h4>Scam Distribution</h4>
          <div className="chart-placeholder">
            {/* In a real app, you would use a charting library here */}
            <div className="chart-bars">
              {['Bank Fraud', 'Phishing', 'Fake Offers', 'Impersonation', 'Other'].map((type, index) => {
                const height = 20 + Math.random() * 80;
                return (
                  <div key={type} className="chart-bar-container">
                    <div className="chart-bar-label">{type}</div>
                    <div className="chart-bar">
                      <div 
                        className="chart-bar-fill"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                    <div className="chart-bar-value">{Math.round(height)}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h4>Detection Confidence</h4>
          <div className="confidence-distribution">
            <div className="confidence-level high">
              <span className="confidence-label">High (&gt;80%)</span>
              <div className="confidence-bar">
                <div className="confidence-fill" style={{ width: '65%' }}></div>
                <span className="confidence-percent">65%</span>
              </div>
            </div>
            <div className="confidence-level medium">
              <span className="confidence-label">Medium (60-80%)</span>
              <div className="confidence-bar">
                <div className="confidence-fill" style={{ width: '25%' }}></div>
                <span className="confidence-percent">25%</span>
              </div>
            </div>
            <div className="confidence-level low">
              <span className="confidence-label">Low (&lt;60%)</span>
              <div className="confidence-bar">
                <div className="confidence-fill" style={{ width: '10%' }}></div>
                <span className="confidence-percent">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="intelligence-insights">
        <h4>Extracted Intelligence</h4>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">📞</div>
            <div className="insight-content">
              <div className="insight-value">142</div>
              <div className="insight-label">Phone Numbers Collected</div>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🔗</div>
            <div className="insight-content">
              <div className="insight-value">89</div>
              <div className="insight-label">Malicious URLs</div>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🏦</div>
            <div className="insight-content">
              <div className="insight-value">23</div>
              <div className="insight-label">Bank Names Used</div>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🎭</div>
            <div className="insight-content">
              <div className="insight-value">15</div>
              <div className="insight-label">Different Tactics</div>
            </div>
          </div>
        </div>
      </div>

      <div className="tactics-analysis">
        <h4>Common Scam Tactics</h4>
        <div className="tactics-list">
          <div className="tactic-item">
            <span className="tactic-name">Urgency Creation</span>
            <span className="tactic-frequency">78%</span>
          </div>
          <div className="tactic-item">
            <span className="tactic-name">Authority Impersonation</span>
            <span className="tactic-frequency">65%</span>
          </div>
          <div className="tactic-item">
            <span className="tactic-name">Fear Induction</span>
            <span className="tactic-frequency">52%</span>
          </div>
          <div className="tactic-item">
            <span className="tactic-name">Greed Exploitation</span>
            <span className="tactic-frequency">45%</span>
          </div>
          <div className="tactic-item">
            <span className="tactic-name">Help Offering</span>
            <span className="tactic-frequency">38%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;