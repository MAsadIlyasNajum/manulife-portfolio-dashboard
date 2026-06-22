import { Box, Paper, Typography } from '@mui/material';
import type { PropsWithChildren } from 'react';

interface PagePlaceholderProps extends PropsWithChildren {
  title: string;
  description: string;
}

export function PagePlaceholder({ title, description, children }: PagePlaceholderProps) {
  return (
    <Box
      sx={{
        minHeight: '100%',
        display: 'grid',
        placeItems: 'center',
        background:
          'radial-gradient(circle at top left, rgba(0, 105, 60, 0.2), transparent 40%), radial-gradient(circle at bottom right, rgba(15, 23, 42, 0.15), transparent 45%), #f4f7f5',
        p: { xs: 2, sm: 3 },
      }}
    >
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, maxWidth: 720, width: '100%' }}>
        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.6rem', sm: '2.125rem' } }}>
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
          {description}
        </Typography>
        {children}
      </Paper>
    </Box>
  );
}
