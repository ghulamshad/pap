'use client';

import { Box } from '@mui/material';
import Navigation from '@/components/Navigation';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Navigation>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Navigation>
  );
} 