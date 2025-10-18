
'use client';

import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from 'react';
import { themes } from '@/lib/themes';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    // Apply the saved theme on initial load
    const savedThemeName = localStorage.getItem('activeTheme');
    const theme = themes.find(t => t.name === savedThemeName) || themes.find(t => t.name === 'Kopi Gayo'); // Fallback to Gayo

    if (theme) {
      const root = document.documentElement;
      Object.entries(theme.light).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value);
      });
      Object.entries(theme.dark).forEach(([key, value]) => {
          root.style.setProperty(`--${key}-dark`, value);
      });

      const darkThemeEl = document.querySelector('.dark');
      if (darkThemeEl) {
           Object.entries(theme.dark).forEach(([key, value]) => {
              (darkThemeEl as HTMLElement).style.setProperty(`--${key}`, value);
          });
      }
    }
  }, []);

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <title>BioLink Elegance</title>
        <meta name="description" content="An elegant biolink page for professionals." />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
