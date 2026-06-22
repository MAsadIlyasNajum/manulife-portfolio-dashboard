import { Alert, Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { AllocationChart } from '../components/dashboard/AllocationChart';
import { PerformanceTable } from '../components/dashboard/PerformanceTable';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { TransactionsList } from '../components/dashboard/TransactionsList';
import { useDashboardData } from '../hooks/use-dashboard-data';
import { getLocaleForLanguage } from '../i18n';
import { formatCurrency, formatPercentage } from '../utils/formatters';

export function DashboardPage() {
  const { t, i18n } = useTranslation();
  const locale = getLocaleForLanguage(i18n.language);
  const {
    portfolio,
    portfoliosQuery,
    summaryQuery,
    allocationQuery,
    performanceQuery,
    transactionsLoading,
    transactionsError,
    allocationItems,
    performanceItems,
    recentTransactions,
  } = useDashboardData();

  const pageError = portfoliosQuery.error;

  if (pageError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t('dashboard.errors.loadDashboard')}</Alert>
      </Box>
    );
  }

  if (!portfoliosQuery.isLoading && !portfolio) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">{t('dashboard.empty.noPortfolio')}</Alert>
      </Box>
    );
  }

  const summary = summaryQuery.data;
  const gainLossTone = !summary
    ? 'neutral'
    : summary.totalGainLoss > 0
      ? 'positive'
      : summary.totalGainLoss < 0
        ? 'negative'
        : 'neutral';

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Stack spacing={3}>
        <Stack spacing={0.75}>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.65rem', sm: '2.125rem' } }}>
            {t('dashboard.title')}
          </Typography>
          <Typography color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
            {portfolio
              ? t('dashboard.subtitleWithName', { name: portfolio.name })
              : t('dashboard.subtitleLoading')}
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))',
            },
            gap: 2,
          }}
        >
          <SummaryCard
            title={t('dashboard.summary.totalInvested')}
            value={summary ? formatCurrency(summary.totalInvested, locale) : ''}
            loading={summaryQuery.isLoading || portfoliosQuery.isLoading}
          />
          <SummaryCard
            title={t('dashboard.summary.currentValue')}
            value={summary ? formatCurrency(summary.currentValue, locale) : ''}
            loading={summaryQuery.isLoading || portfoliosQuery.isLoading}
          />
          <SummaryCard
            title={t('dashboard.summary.gainLoss')}
            value={summary ? formatCurrency(summary.totalGainLoss, locale) : ''}
            loading={summaryQuery.isLoading || portfoliosQuery.isLoading}
            tone={gainLossTone}
          />
          <SummaryCard
            title={t('dashboard.summary.returnPercentage')}
            value={summary ? formatPercentage(summary.gainLossPercentage, locale) : ''}
            loading={summaryQuery.isLoading || portfoliosQuery.isLoading}
            tone={gainLossTone}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.2fr) minmax(0, 0.8fr)' },
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <AllocationChart
              items={allocationItems}
              loading={allocationQuery.isLoading}
              error={allocationQuery.error ? t('dashboard.errors.loadAllocation') : null}
            />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <TransactionsList
              items={recentTransactions}
              loading={transactionsLoading}
              error={transactionsError ? t('dashboard.errors.loadTransactions') : null}
            />
          </Box>
        </Box>

        <PerformanceTable
          rows={performanceItems}
          loading={performanceQuery.isLoading}
          error={performanceQuery.error ? t('dashboard.errors.loadPerformance') : null}
        />
      </Stack>
    </Box>
  );
}
