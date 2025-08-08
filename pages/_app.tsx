import type { AppProps } from 'next/app';
import { SocialStoreProvider } from '../contexts/SocialStore';
import { ThemeProvider } from '../contexts/ThemeProvider';
import '../styles/globals.css';
import '../styles/theme.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SocialStoreProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </SocialStoreProvider>
  );
} 