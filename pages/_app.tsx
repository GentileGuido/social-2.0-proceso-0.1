import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { SocialProvider } from '../contexts/SocialContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import FirebaseGate from '../components/FirebaseGate';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <FirebaseGate>
        <AuthProvider>
          <SocialProvider>
            <Component {...pageProps} />
          </SocialProvider>
        </AuthProvider>
      </FirebaseGate>
    </ThemeProvider>
  );
} 