import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { TransactionType } from '@portfolio/shared-types';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { portfolioService } from '../api/services/portfolio.service';
import { useTransactionHistory } from '../hooks/use-transaction-history';
import { getLocaleForLanguage } from '../i18n';
import { formatCurrency, formatNumber } from '../utils/formatters';

type TransactionFilter = 'ALL' | TransactionType;

function formatDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function TransactionsPage() {
  const { t, i18n } = useTranslation();
  const locale = getLocaleForLanguage(i18n.language);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedPortfolioId, setSelectedPortfolioId] = useState('');
  const [filter, setFilter] = useState<TransactionFilter>('ALL');
  const [search, setSearch] = useState('');

  const portfoliosQuery = useQuery({
    queryKey: ['transactions', 'portfolios'],
    queryFn: () => portfolioService.list({ page: 1, limit: 100 }),
  });

  useEffect(() => {
    if (!selectedPortfolioId && portfoliosQuery.data?.data.length) {
      setSelectedPortfolioId(portfoliosQuery.data.data[0].id);
    }
  }, [portfoliosQuery.data, selectedPortfolioId]);

  const { items, loading, error } = useTransactionHistory(selectedPortfolioId);

  const visibleTransactions = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesType = filter === 'ALL' ? true : item.type === filter;
      const matchesSearch = searchTerm
        ? item.investmentName.toLowerCase().includes(searchTerm)
        : true;

      return matchesType && matchesSearch;
    });
  }, [filter, items, search]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="h4">{t('transactionsPage.title')}</Typography>
          <Typography color="text.secondary">{t('transactionsPage.description')}</Typography>
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1}
          sx={{ alignItems: { xs: 'stretch', md: 'center' } }}
        >
          <FormControl size="small" sx={{ width: { xs: '100%', sm: 280 }, minWidth: 0 }}>
            <InputLabel id="transactions-portfolio-label">{t('common.labels.portfolio')}</InputLabel>
            <Select
              labelId="transactions-portfolio-label"
              label={t('common.labels.portfolio')}
              value={selectedPortfolioId}
              onChange={(event) => setSelectedPortfolioId(event.target.value)}
            >
              {(portfoliosQuery.data?.data ?? []).map((portfolio) => (
                <MenuItem key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ width: { xs: '100%', sm: 220 }, minWidth: 0 }}>
            <InputLabel id="transactions-filter-label">{t('transactionsPage.filters.type')}</InputLabel>
            <Select
              labelId="transactions-filter-label"
              label={t('transactionsPage.filters.type')}
              value={filter}
              onChange={(event) => setFilter(event.target.value as TransactionFilter)}
            >
              <MenuItem value="ALL">{t('transactionsPage.filters.all')}</MenuItem>
              <MenuItem value="BUY">{t('transactionsPage.filters.buy')}</MenuItem>
              <MenuItem value="SELL">{t('transactionsPage.filters.sell')}</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            label={t('transactionsPage.filters.searchLabel')}
            placeholder={t('transactionsPage.filters.searchPlaceholder')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ width: { xs: '100%', md: 320 }, minWidth: 0 }}
            inputProps={{
              'aria-label': t('transactionsPage.filters.searchLabel'),
            }}
          />
        </Stack>

        {(portfoliosQuery.error || error) && (
          <Alert severity="error">{t('transactionsPage.errors.loadData')}</Alert>
        )}

        <Paper variant="outlined">
          {loading || portfoliosQuery.isLoading ? (
            <Stack spacing={1.25} sx={{ p: 1.5 }}>
              <Skeleton variant="rounded" height={72} />
              <Skeleton variant="rounded" height={72} />
              <Skeleton variant="rounded" height={72} />
              <Skeleton variant="rounded" height={72} />
            </Stack>
          ) : visibleTransactions.length === 0 ? (
            <Box sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
              <Typography variant="h6">{t('transactionsPage.empty.title')}</Typography>
              <Typography color="text.secondary">{t('transactionsPage.empty.description')}</Typography>
            </Box>
          ) : isMobile ? (
            <Stack spacing={1.25} sx={{ p: 1.5 }}>
              {visibleTransactions.map((transaction) => (
                <Card key={transaction.id} variant="outlined">
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Stack spacing={1.25}>
                      <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="center">
                        <Typography variant="subtitle2" sx={{ overflowWrap: 'anywhere' }}>
                          {transaction.investmentName || t('common.labels.unknownInvestment')}
                        </Typography>
                        <Chip
                          size="small"
                          color={transaction.type === 'BUY' ? 'success' : 'error'}
                          variant="outlined"
                          label={
                            transaction.type === 'BUY'
                              ? t('transactionsPage.filters.buy')
                              : t('transactionsPage.filters.sell')
                          }
                        />
                      </Stack>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                          gap: 1,
                        }}
                      >
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t('transactionsPage.columns.date')}
                          </Typography>
                          <Typography variant="body2">{formatDate(transaction.transactionDate, locale)}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t('transactionsPage.columns.assetType')}
                          </Typography>
                          <Typography variant="body2">{t(`investments.assetTypes.${transaction.assetType}`)}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t('transactionsPage.columns.quantity')}
                          </Typography>
                          <Typography variant="body2">{formatNumber(Number(transaction.quantity), locale)}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t('transactionsPage.columns.price')}
                          </Typography>
                          <Typography variant="body2">{formatCurrency(Number(transaction.price), locale)}</Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {t('transactionsPage.columns.totalValue')}
                        </Typography>
                        <Typography variant="body2">{formatCurrency(transaction.totalValue, locale)}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 980 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('transactionsPage.columns.date')}</TableCell>
                    <TableCell>{t('transactionsPage.columns.assetName')}</TableCell>
                    <TableCell>{t('transactionsPage.columns.assetType')}</TableCell>
                    <TableCell>{t('transactionsPage.columns.transactionType')}</TableCell>
                    <TableCell align="right">{t('transactionsPage.columns.quantity')}</TableCell>
                    <TableCell align="right">{t('transactionsPage.columns.price')}</TableCell>
                    <TableCell align="right">{t('transactionsPage.columns.totalValue')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleTransactions.map((transaction) => (
                    <TableRow key={transaction.id} hover>
                      <TableCell>{formatDate(transaction.transactionDate, locale)}</TableCell>
                      <TableCell>{transaction.investmentName || t('common.labels.unknownInvestment')}</TableCell>
                      <TableCell>{t(`investments.assetTypes.${transaction.assetType}`)}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          color={transaction.type === 'BUY' ? 'success' : 'error'}
                          variant="outlined"
                          label={
                            transaction.type === 'BUY'
                              ? t('transactionsPage.filters.buy')
                              : t('transactionsPage.filters.sell')
                          }
                        />
                      </TableCell>
                      <TableCell align="right">{formatNumber(Number(transaction.quantity), locale)}</TableCell>
                      <TableCell align="right">{formatCurrency(Number(transaction.price), locale)}</TableCell>
                      <TableCell align="right">{formatCurrency(transaction.totalValue, locale)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Paper>
      </Stack>
    </Box>
  );
}
