'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import OllamaInterview from './OllamaInterview';

interface EditorProps {
  session: any;
}

export default function PortfolioEditor({ session }: EditorProps) {
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showInterview, setShowInterview] = useState(false);
  const [interviewSection, setInterviewSection] = useState('');

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch(`/api/portfolio/${session.user.username}`);
      if (response.ok) {
        const data = await response.json();
        setPortfolioData(data);
      } else {
        setPortfolioData({
          personal: { name: '', title: '', location: '', bio: '', photo: '', resumeUrl: '' },
          workExperience: [],
          education: [],
          projects: [],
          skills: { frontend: [], backend: [], tools: [], other: [] },
          socialLinks: []
        });
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolioData),
      });

      if (response.ok) {
        setMessage('Portfolio saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save portfolio');
      }
    } catch (error) {
      setMessage('Error saving portfolio');
    } finally {
      setSaving(false);
    }
  };

  const startInterview = (section: string) => {
    setInterviewSection(section);
    setShowInterview(true);
  };

  const handleInterviewComplete = (data: any) => {
    if (interviewSection === 'work') {
      setPortfolioData({
        ...portfolioData,
        workExperience: [...(portfolioData.workExperience || []), data]
      });
    } else if (interviewSection === 'education') {
      setPortfolioData({
        ...portfolioData,
        education: [...(portfolioData.education || []), data]
      });
    } else if (interviewSection === 'projects') {
      setPortfolioData({
        ...portfolioData,
        projects: [...(portfolioData.projects || []), data]
      });
    }
    setShowInterview(false);
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (showInterview) {
    return (
      <OllamaInterview
        section={interviewSection}
        onComplete={handleInterviewComplete}
        onCancel={() => setShowInterview(false)}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Portfolio Editor</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a
              href={`http://localhost:5173/${session.user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.5rem 1rem',
                background: '#333',
                borderRadius: '6px',
                textDecoration: 'none',
                color: '#fff'
              }}
            >
              View Portfolio
            </a>
            <button
              onClick={() => signOut()}
              style={{
                padding: '0.5rem 1rem',
                background: '#333',
                border: 'none',
                borderRadius: '6px',
                color: '#fff'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {message && (
          <div style={{
            padding: '1rem',
            marginBottom: '1rem',
            background: message.includes('success') ? '#113311' : '#331111',
            border: `1px solid ${message.includes('success') ? '#116611' : '#661111'}`,
            borderRadius: '6px',
            color: message.includes('success') ? '#66ff66' : '#ff6666'
          }}>
            {message}
          </div>
        )}

        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #333' }}>
          <h2 style={{ marginBottom: '1rem' }}>Personal Information</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Name"
              value={portfolioData?.personal?.name || ''}
              onChange={(e) => setPortfolioData({
                ...portfolioData,
                personal: { ...portfolioData.personal, name: e.target.value }
              })}
              style={{ padding: '0.75rem', background: '#0a0a0a', border: '1px solid #333', borderRadius: '6px', color: '#fff' }}
            />
            <input
              type="text"
              placeholder="Title"
              value={portfolioData?.personal?.title || ''}
              onChange={(e) => setPortfolioData({
                ...portfolioData,
                personal: { ...portfolioData.personal, title: e.target.value }
              })}
              style={{ padding: '0.75rem', background: '#0a0a0a', border: '1px solid #333', borderRadius: '6px', color: '#fff' }}
            />
            <input
              type="text"
              placeholder="Location"
              value={portfolioData?.personal?.location || ''}
              onChange={(e) => setPortfolioData({
                ...portfolioData,
                personal: { ...portfolioData.personal, location: e.target.value }
              })}
              style={{ padding: '0.75rem', background: '#0a0a0a', border: '1px solid #333', borderRadius: '6px', color: '#fff' }}
            />
            <textarea
              placeholder="Bio"
              value={portfolioData?.personal?.bio || ''}
              onChange={(e) => setPortfolioData({
                ...portfolioData,
                personal: { ...portfolioData.personal, bio: e.target.value }
              })}
              rows={3}
              style={{ padding: '0.75rem', background: '#0a0a0a', border: '1px solid #333', borderRadius: '6px', color: '#fff', resize: 'vertical' }}
            />
          </div>
        </div>

        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Work Experience</h2>
            <button
              onClick={() => startInterview('work')}
              style={{
                padding: '0.5rem 1rem',
                background: '#4a9eff',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            >
              AI Interview
            </button>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
            {portfolioData?.workExperience?.length || 0} entries
          </p>
        </div>

        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Education</h2>
            <button
              onClick={() => startInterview('education')}
              style={{
                padding: '0.5rem 1rem',
                background: '#4a9eff',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            >
              AI Interview
            </button>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
            {portfolioData?.education?.length || 0} entries
          </p>
        </div>

        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Projects</h2>
            <button
              onClick={() => startInterview('projects')}
              style={{
                padding: '0.5rem 1rem',
                background: '#4a9eff',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            >
              AI Interview
            </button>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
            {portfolioData?.projects?.length || 0} entries
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%',
            padding: '1rem',
            background: '#4a9eff',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '600',
            marginTop: '1rem'
          }}
        >
          {saving ? 'Saving...' : 'Save Portfolio'}
        </button>
      </div>
    </div>
  );
}
