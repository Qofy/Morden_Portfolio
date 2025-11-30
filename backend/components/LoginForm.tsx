'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError('Invalid email or password');
        } else {
          window.location.reload();
        }
      } else {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Registration failed');
        } else {
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
          });

          if (result?.error) {
            setError('Account created but login failed');
          } else {
            window.location.reload();
          }
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      padding: '1rem'
    }}>
      <div style={{
        background: '#1a1a1a',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid #333',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          {isLogin ? 'Login' : 'Register'}
        </h1>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #333',
                  background: '#0a0a0a',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #333',
                background: '#0a0a0a',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #333',
                background: '#0a0a0a',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>

          {error && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              background: '#331111',
              border: '1px solid #661111',
              borderRadius: '6px',
              color: '#ff6666',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '6px',
              border: 'none',
              background: '#4a9eff',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#4a9eff',
              fontSize: '0.9rem'
            }}
          >
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
