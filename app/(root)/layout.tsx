import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '../globals.css';
import Topbar from '@/components/shared/topbar';
import LeftSidebar from '@/components/shared/left-sidebar';
import RightSidebar from '@/components/shared/rigth-sidebar';
import Bottombar from '@/components/shared/bottombar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Threads',
  description: 'A Next.js 13 Project'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Topbar />

          <main className='flex flex-row'>
            <LeftSidebar />

            <section className='main-container'>
              <div className='w-full max-w-4xl'>
                {children}
              </div>
            </section>

            <RightSidebar />
          </main>

          <Bottombar />
        </body>
      </html> 
    </ClerkProvider>
  )
}
