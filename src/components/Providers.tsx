'use client';

import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import { store } from '@/redux/store';
import { theme } from '@/app/theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </Provider>
  );
} 