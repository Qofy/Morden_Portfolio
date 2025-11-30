'use client';

import { useState, useRef, useEffect } from 'react';

interface InterviewProps {
  section: string;
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export default function OllamaInterview({ section, onComplete, onCancel }: InterviewProps) {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: getSectionIntroMessage(section) }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function getSectionIntroMessage(section: string): string {
    switch (section) {
      case 'work':
        return "Hi! I'll help you add your work experience. Let's start with: What was your most recent job title?";
      case 'education':
        return "Hi! I'll help you add your education. Let's start with: What degree did you earn?";
      case 'projects':
        return "Hi! I'll help you add a project to your portfolio. Let's start with: What's the name of your project?";
      default:
        return "Hi! Let's get started.";
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ollama-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          messages: newMessages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      setMessages([...newMessages, { role: 'assistant', content: data.message }]);

      if (data.completed && data.data) {
        setExtractedData(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleComplete = () => {
    if (extractedData) {
      onComplete(extractedData);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      <div style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2>AI Interview - {section.charAt(0).toUpperCase() + section.slice(1)}</h2>
        <button
          onClick={onCancel}
          style={{
            padding: '0.5rem 1rem',
            background: '#333',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '70%',
              padding: '1rem',
              borderRadius: '12px',
              background: msg.role === 'user' ? '#4a9eff' : '#1a1a1a',
              color: '#fff',
              border: msg.role === 'user' ? 'none' : '1px solid #333'
            }}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div style={{
            alignSelf: 'flex-start',
            maxWidth: '70%',
            padding: '1rem',
            borderRadius: '12px',
            background: '#1a1a1a',
            color: '#888',
            border: '1px solid #333'
          }}>
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {extractedData && (
        <div style={{
          padding: '1rem 2rem',
          background: '#113311',
          border: '1px solid #116611',
          borderRadius: '6px',
          margin: '0 2rem',
          marginBottom: '1rem'
        }}>
          <p style={{ color: '#66ff66', marginBottom: '0.5rem' }}>
            Data extracted successfully! Review and save when ready.
          </p>
          <button
            onClick={handleComplete}
            style={{
              padding: '0.5rem 1rem',
              background: '#4a9eff',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Save & Continue
          </button>
        </div>
      )}

      <div style={{
        padding: '1rem 2rem',
        borderTop: '1px solid #333',
        display: 'flex',
        gap: '1rem'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your response..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.75rem',
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '1rem'
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#4a9eff',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.5 : 1
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
