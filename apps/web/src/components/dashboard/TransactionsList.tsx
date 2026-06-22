import {
    Alert,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    Paper,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { RecentTransactionItem } from '../../hooks/use-dashboard-data';
import { getLocaleForLanguage } from '../../i18n';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface TransactionsListProps {
    items: RecentTransactionItem[];
    loading?: boolean;
    error?: string | null;
}

function formatDate(value: string, locale: string): string {
    return new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value));
}

export function TransactionsList({ items, loading = false, error = null }: TransactionsListProps) {
    const { t, i18n } = useTranslation();
    const locale = getLocaleForLanguage(i18n.language);

    return (
        <Paper variant="outlined" sx={{ p: { xs: 1.75, sm: 2.5 }, height: '100%' }}>
            <Stack spacing={2}>
                <Typography variant="h6">{t('dashboard.transactions.title')}</Typography>
                {loading ? (
                    <Stack spacing={1.25}>
                        <Skeleton variant="rounded" height={64} />
                        <Skeleton variant="rounded" height={64} />
                        <Skeleton variant="rounded" height={64} />
                    </Stack>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : items.length === 0 ? (
                    <Alert severity="info">{t('dashboard.empty.noTransactions')}</Alert>
                ) : (
                    <List disablePadding>
                        {items.map((item, index) => (
                            <Stack key={item.id}>
                                <ListItem disableGutters>
                                    <ListItemText
                                        primaryTypographyProps={{ component: 'div' }}
                                        secondaryTypographyProps={{ component: 'div' }}
                                        primary={
                                            <Stack
                                                direction={{ xs: 'column', sm: 'row' }}
                                                justifyContent="space-between"
                                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                                                sx={{ gap: 2 }}
                                            >
                                                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
                                                    <Chip
                                                        size="small"
                                                        label={
                                                            item.type === 'BUY'
                                                                ? t('dashboard.transactions.buy')
                                                                : t('dashboard.transactions.sell')
                                                        }
                                                        color={item.type === 'BUY' ? 'success' : 'error'}
                                                        variant="outlined"
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            overflowWrap: 'anywhere',
                                                        }}
                                                    >
                                                        {item.investmentName || t('common.labels.unknownInvestment')}
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="body2" color="text.secondary">
                                                    {formatDate(item.transactionDate, locale)}
                                                </Typography>
                                            </Stack>
                                        }
                                        secondary={
                                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ mt: 0.75 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {t('common.labels.qtyWithValue', {
                                                        value: formatNumber(Number(item.quantity), locale),
                                                    })}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {t('common.labels.priceWithValue', {
                                                        value: formatCurrency(Number(item.price), locale),
                                                    })}
                                                </Typography>
                                            </Stack>
                                        }
                                    />
                                </ListItem>
                                {index < items.length - 1 ? <Divider component="li" /> : null}
                            </Stack>
                        ))}
                    </List>
                )}
            </Stack>
        </Paper>
    );
}