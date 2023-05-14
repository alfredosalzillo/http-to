import { Inter } from 'next/font/google';
import React from 'react';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'HTTP-TO - Online HTTP request converter',
  description: 'Convert HTTP requests to javascript fetch, dart request',
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <html lang="en">
    <body className={inter.className}>{children}</body>
  </html>
);

export default RootLayout;
