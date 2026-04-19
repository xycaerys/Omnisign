'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';

type SiteShellProps = {
  children: ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return children;
  }

  return (
    <>
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
