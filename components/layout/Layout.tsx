import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'MoodVibes' }: Props) => {
  const router = useRouter();
  const isWelcomePage = router.pathname === '/welcome';

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {!isWelcomePage && (
        <header className="bg-white shadow-sm">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <a href="/" className="text-2xl font-bold text-primary-600">MoodVibes</a>
              <div className="flex space-x-4">
                <a href="/dashboard" className="text-gray-600 hover:text-primary-600">Dashboard</a>
                <a href="/connections" className="text-gray-600 hover:text-primary-600">Connexions</a>
                <a href="/profile" className="text-gray-600 hover:text-primary-600">Profil</a>
              </div>
            </div>
          </nav>
        </header>
      )}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;