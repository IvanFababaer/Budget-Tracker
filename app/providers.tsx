'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider 
      attribute="data-theme" 
      defaultTheme="light"
      enableSystem={false} // Prevents conflict between user's OS theme and your 50 themes
    >
      {children}
    </ThemeProvider>
  );
}