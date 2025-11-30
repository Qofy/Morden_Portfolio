import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import SessionProvider from '@/components/SessionProvider';
import './globals.css';

export const metadata = {
  title: 'Portfolio Dashboard',
  description: 'Manage your portfolio',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
