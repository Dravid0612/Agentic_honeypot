import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL, API_KEY } from '../apiConfig';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detectionInfo, setDetectionInfo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    generateNewSession();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateNewSession = () => {
    const newSessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    setSessionId(newSessionId);
    setMessages([]);
    setDetectionInfo(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      sender: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify({
          sessionId: sessionId,
          message: {
            sender: 'scammer',
            text: inputText,
            timestamp: Date.now()
          },
          conversationHistory: messages.map(msg => ({
            sender: msg.sender === 'user' ? 'scammer' : 'user',
            text: msg.text,
            timestamp: msg.timestamp
          }))
        })
      });

      const data = await response.json();

      const botMessage = {
        sender: 'bot',
        text: data.reply,
        timestamp: Date.now(),
        metadata: {
          detection: data.detection,
          intelligence: data.intelligence
        }
      };

      setMessages(prev => [...prev, botMessage]);
      setDetectionInfo(data.detection);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        sender: 'system',
        text: 'Error: Could not get response from server',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMessageClass = (sender) => {
    switch (sender) {
      case 'user': return 'message-user';
      case 'bot': return 'message-bot';
      case 'system': return 'message-system';
      default: return '';
    }
  };

  const formatScamType = (type) => {
    return type ? type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') : 'Unknown';
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="session-info">
          <span className="session-label">Session ID:</span>
          <code className="session-id">{sessionId}</code>
          <button 
            className="btn-new-session"
            onClick={generateNewSession}
          >
            New Session
          </button>
        </div>
        
        {detectionInfo && (
          <div className="detection-status">
            <div className={`status-indicator ${detectionInfo.is_scam ? 'scam-detected' : 'no-scam'}`}>
              {detectionInfo.is_scam ? '🚨 Scam Detected' : '✅ No Scam'}
            </div>
            {detectionInfo.is_scam && (
              <div className="scam-details">
                <span className="scam-type">Type: {formatScamType(detectionInfo.scam_type)}</span>
                <span className="confidence">Confidence: {(detectionInfo.confidence * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🤖</div>
            <h3>Start a Conversation</h3>
            <p>Enter a scam message to see how the honeypot agent responds</p>
            <div className="example-messages">
              <button 
                className="example-btn"
                onClick={() => setInputText("Your bank account will be blocked today. Verify immediately.")}
              >
                Bank Fraud Example
              </button>
              <button 
                className="example-btn"
                onClick={() => setInputText("You've won $5000! Click here to claim your prize.")}
              >
                Fake Offer Example
              </button>
              <button 
                className="example-btn"
                onClick={() => setInputText("Your iCloud has been hacked. Login to secure your account.")}
              >
                Phishing Example
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${getMessageClass(msg.sender)}`}>
              <div className="message-sender">
                {msg.sender === 'user' ? '👤 You' : 
                 msg.sender === 'bot' ? '🤖 Agent' : 
                 '⚙️ System'}
              </div>
              <div className="message-text">{msg.text}</div>
              <div className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              
              {msg.metadata?.detection && msg.sender === 'bot' && (
                <div className="message-metadata">
                  <div className="detection-summary">
                    <strong>Detection:</strong> 
                    {msg.metadata.detection.is_scam ? ' Scam' : ' Legitimate'} 
                    ({(msg.metadata.detection.confidence * 100).toFixed(1)}%)
                  </div>
                  {msg.metadata.intelligence && (
                    <details className="intelligence-details">
                      <summary>Extracted Intelligence</summary>
                      <div className="intelligence-grid">
                        {msg.metadata.intelligence.urls?.length > 0 && (
                          <div className="intel-item">
                            <strong>URLs:</strong> {msg.metadata.intelligence.urls.join(', ')}
                          </div>
                        )}
                        {msg.metadata.intelligence.phone_numbers?.length > 0 && (
                          <div className="intel-item">
                            <strong>Phone Numbers:</strong> {msg.metadata.intelligence.phone_numbers.join(', ')}
                          </div>
                        )}
                        {msg.metadata.intelligence.scam_tactics?.length > 0 && (
                          <div className="intel-item">
                            <strong>Tactics:</strong> {msg.metadata.intelligence.scam_tactics.join(', ')}
                          </div>
                        )}
                      </div>
                    </details>
                  )}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          className="message-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter scam message here..."
          disabled={isLoading}
          rows={3}
        />
        <div className="input-controls">
          <button
            className="btn-send"
            onClick={sendMessage}
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
