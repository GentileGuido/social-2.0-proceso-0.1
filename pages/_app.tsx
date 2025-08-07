import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AuthProvider } from '../contexts/AuthContext';
import { SocialProvider } from '../contexts/SocialContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Social</title>
        <meta name="description" content="A social networking app for managing groups and names" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3B82F6" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      
      <AuthProvider>
        <ThemeProvider>
          <SocialProvider>
            <Component {...pageProps} />
          </SocialProvider>
        </ThemeProvider>
      </AuthProvider>
    </>
  );
} 