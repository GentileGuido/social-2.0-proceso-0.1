import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { SocialProvider } from '../contexts/SocialContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocialProvider>
          <Component {...pageProps} />
        </SocialProvider>
      </AuthProvider>
    </ThemeProvider>
  );
} 