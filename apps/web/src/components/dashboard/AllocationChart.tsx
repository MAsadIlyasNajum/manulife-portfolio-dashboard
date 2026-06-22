import { Alert, Box, Paper, Skeleton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import type { AllocationItem } from '../../api/services/analytics.service';
import { getLocaleForLanguage } from '../../i18n';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface AllocationChartProps {
    items: AllocationItem[];
    loading?: boolean;
    error?: string | null;
}

const COLORS = ['#00693C', '#2D8A62', '#7EBB9B', '#A8D7C2', '#D4ECE1', '#0F172A'];

export function AllocationChart({ items, loading = false, error = null }: AllocationChartProps) {
    const { t, i18n } = useTranslation();
    const locale = getLocaleForLanguage(i18n.language);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Paper variant="outlined" sx={{ p: { xs: 1.75, sm: 2.5 }, height: '100%' }}>
            <Stack spacing={2}>
                <Typography variant="h6">{t('dashboard.allocation.title')}</Typography>
                {loading ? (
                    <Stack spacing={2}>
                        <Skeleton variant="rounded" height={280} />
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="75%" />
                    </Stack>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : items.length === 0 ? (
                    <Alert severity="info">{t('dashboard.empty.noAllocation')}</Alert>
                ) : (
                    <>
                        <Box sx={{ width: '100%', height: { xs: 220, sm: 280 } }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={items}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={isMobile ? 45 : 65}
                                        outerRadius={isMobile ? 78 : 100}
                                        paddingAngle={2}
                                    >
                                        {items.map((item, index) => (
                                            <Cell key={item.investmentId} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(Number(value), locale)}
                                        contentStyle={{ borderRadius: 12, borderColor: 'rgba(0, 105, 60, 0.12)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                        <Stack spacing={1.25}>
                            {items.map((item, index) => (
                                <Stack
                                    key={item.investmentId}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ gap: 2 }}
                                >
                                    <Stack direction="row" spacing={1.25} alignItems="center">
                                        <Box
                                            sx={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: '50%',
                                                bgcolor: COLORS[index % COLORS.length],
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                minWidth: 0,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: { xs: 150, sm: 220 },
                                            }}
                                        >
                                            {item.name}
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatPercentage(item.percentage, locale)}
                                    </Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </>
                )}
            </Stack>
        </Paper>
    );
}