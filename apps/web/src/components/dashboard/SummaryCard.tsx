import { Paper, Skeleton, Stack, Typography } from '@mui/material';

interface SummaryCardProps {
    title: string;
    value: string;
    subtitle?: string;
    loading?: boolean;
    tone?: 'neutral' | 'positive' | 'negative';
}

const toneMap = {
    neutral: 'text.primary',
    positive: 'success.main',
    negative: 'error.main',
} as const;

export function SummaryCard({ title, value, subtitle, loading = false, tone = 'neutral' }: SummaryCardProps) {
    return (
        <Paper variant="outlined" sx={{ p: { xs: 1.75, sm: 2.5 }, minHeight: 132 }}>
            <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                    {title}
                </Typography>
                {loading ? (
                    <>
                        <Skeleton variant="text" width="75%" height={44} />
                        <Skeleton variant="text" width="40%" />
                    </>
                ) : (
                    <>
                        <Typography
                            variant="h5"
                            color={toneMap[tone]}
                            sx={{
                                fontSize: { xs: '1.3rem', sm: '1.5rem' },
                                lineHeight: 1.25,
                                overflowWrap: 'anywhere',
                            }}
                        >
                            {value}
                        </Typography>
                        {subtitle ? (
                            <Typography variant="body2" color="text.secondary">
                                {subtitle}
                            </Typography>
                        ) : null}
                    </>
                )}
            </Stack>
        </Paper>
    );
}