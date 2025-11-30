'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import LoginForm from '@/components/LoginForm';
import PortfolioEditor from '@/components/PortfolioEditor';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (status === 'loading') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#fff'
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  return <PortfolioEditor session={session} />;
}
