import {
    Alert,
    Box,
    Paper,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { PerformanceItem } from '../../api/services/analytics.service';
import { getLocaleForLanguage } from '../../i18n';
import { formatCurrency } from '../../utils/formatters';

interface PerformanceTableProps {
    rows: PerformanceItem[];
    loading?: boolean;
    error?: string | null;
}

export function PerformanceTable({ rows, loading = false, error = null }: PerformanceTableProps) {
    const { t, i18n } = useTranslation();
    const locale = getLocaleForLanguage(i18n.language);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Paper variant="outlined" sx={{ p: { xs: 1.75, sm: 2.5 } }}>
            <Stack spacing={2}>
                <Typography variant="h6">{t('dashboard.performance.title')}</Typography>
                {loading ? (
                    <Stack spacing={1.25}>
                        <Skeleton variant="rounded" height={44} />
                        <Skeleton variant="rounded" height={44} />
                        <Skeleton variant="rounded" height={44} />
                    </Stack>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : rows.length === 0 ? (
                    <Alert severity="info">{t('dashboard.empty.noPerformance')}</Alert>
                ) : isMobile ? (
                    <Stack spacing={1.25}>
                        {rows.map((row) => (
                            <Paper key={row.investmentId} variant="outlined" sx={{ p: 1.25 }}>
                                <Stack spacing={0.75}>
                                    <Typography variant="subtitle2">{row.name}</Typography>
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                                            gap: 1,
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {t('common.labels.buy')}
                                            </Typography>
                                            <Typography variant="body2">{formatCurrency(row.totalBuyValue, locale)}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {t('common.labels.sell')}
                                            </Typography>
                                            <Typography variant="body2">{formatCurrency(row.totalSellValue, locale)}</Typography>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            {t('common.labels.netFlow')}
                                        </Typography>
                                        <Typography variant="body2">{formatCurrency(row.netFlow, locale)}</Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                ) : (
                    <TableContainer sx={{ overflowX: 'auto' }}>
                        <Table size="small" sx={{ minWidth: 560 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('common.labels.investment')}</TableCell>
                                    <TableCell align="right">{t('common.labels.totalBuyValue')}</TableCell>
                                    <TableCell align="right">{t('common.labels.totalSellValue')}</TableCell>
                                    <TableCell align="right">{t('common.labels.netFlow')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.investmentId} hover>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell align="right">{formatCurrency(row.totalBuyValue, locale)}</TableCell>
                                        <TableCell align="right">{formatCurrency(row.totalSellValue, locale)}</TableCell>
                                        <TableCell align="right">{formatCurrency(row.netFlow, locale)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Stack>
        </Paper>
    );
}