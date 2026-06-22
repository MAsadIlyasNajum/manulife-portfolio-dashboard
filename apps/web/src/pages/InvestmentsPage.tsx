import { useEffect, useMemo, useState } from 'react';
import type { TFunction } from 'i18next';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { AssetType as AssetTypeType, InvestmentDto } from '@portfolio/shared-types';
import { AssetType } from '@portfolio/shared-types';

import { investmentService } from '../api/services/investment.service';
import { getLocaleForLanguage } from '../i18n';
import { portfolioService } from '../api/services/portfolio.service';
import { formatCurrency } from '../utils/formatters';

interface InvestmentFormValues {
  portfolioId: string;
  name: string;
  assetType: AssetTypeType;
  quantity: string;
  purchasePrice: string;
  currentPrice: string;
}

const EMPTY_FORM: InvestmentFormValues = {
  portfolioId: '',
  name: '',
  assetType: AssetType.STOCK,
  quantity: '',
  purchasePrice: '',
  currentPrice: '',
};

const assetTypeOptions: AssetTypeType[] = [AssetType.STOCK, AssetType.BOND, AssetType.MUTUAL_FUND];

function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return 0;
}

function getValidationError(values: InvestmentFormValues, t: TFunction): string | null {
  if (!values.portfolioId.trim()) {
    return t('investments.validation.portfolioRequired');
  }
  if (values.name.trim().length < 2) {
    return t('investments.validation.nameMinLength');
  }

  const quantity = Number(values.quantity);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return t('investments.validation.quantityPositive');
  }

  const purchasePrice = Number(values.purchasePrice);
  if (!Number.isFinite(purchasePrice) || purchasePrice <= 0) {
    return t('investments.validation.purchasePricePositive');
  }

  const currentPrice = Number(values.currentPrice);
  if (!Number.isFinite(currentPrice) || currentPrice <= 0) {
    return t('investments.validation.currentPricePositive');
  }

  return null;
}

function toFormValues(investment: InvestmentDto): InvestmentFormValues {
  return {
    portfolioId: investment.portfolioId,
    name: investment.name,
    assetType: investment.assetType,
    quantity: String(investment.quantity),
    purchasePrice: String(investment.purchasePrice),
    currentPrice: String(investment.currentPrice),
  };
}

export function InvestmentsPage() {
  const { t, i18n } = useTranslation();
  const locale = getLocaleForLanguage(i18n.language);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const queryClient = useQueryClient();
  const [selectedPortfolioId, setSelectedPortfolioId] = useState('');
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formOpen, setFormOpen] = useState(false);
  const [activeInvestmentId, setActiveInvestmentId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<InvestmentFormValues>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  const portfoliosQuery = useQuery({
    queryKey: ['investments', 'portfolios'],
    queryFn: () => portfolioService.list({ page: 1, limit: 100 }),
  });

  useEffect(() => {
    if (!selectedPortfolioId && portfoliosQuery.data?.data.length) {
      setSelectedPortfolioId(portfoliosQuery.data.data[0].id);
    }
  }, [portfoliosQuery.data, selectedPortfolioId]);

  const investmentsQuery = useQuery({
    queryKey: ['investments', 'list', selectedPortfolioId],
    queryFn: () => investmentService.listByPortfolio(selectedPortfolioId, { page: 1, limit: 100 }),
    enabled: Boolean(selectedPortfolioId),
  });

  const invalidateRelevantQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['investments', 'list'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: async (values: InvestmentFormValues) => {
      return investmentService.create(values.portfolioId, {
        name: values.name.trim(),
        assetType: values.assetType,
        quantity: Number(values.quantity),
        purchasePrice: Number(values.purchasePrice),
        currentPrice: Number(values.currentPrice),
      });
    },
    onSuccess: async () => {
      await invalidateRelevantQueries();
      setFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ investmentId, values }: { investmentId: string; values: InvestmentFormValues }) => {
      return investmentService.update(investmentId, {
        portfolioId: values.portfolioId,
        name: values.name.trim(),
        assetType: values.assetType,
        quantity: Number(values.quantity),
        purchasePrice: Number(values.purchasePrice),
        currentPrice: Number(values.currentPrice),
      });
    },
    onSuccess: async () => {
      await invalidateRelevantQueries();
      setFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (investmentId: string) => investmentService.remove(investmentId),
    onSuccess: async () => {
      await invalidateRelevantQueries();
    },
  });

  const onOpenCreate = () => {
    const portfolioId = selectedPortfolioId || portfoliosQuery.data?.data[0]?.id || '';
    setFormMode('create');
    setActiveInvestmentId(null);
    setFormValues({ ...EMPTY_FORM, portfolioId });
    setFormError(null);
    setPageError(null);
    setFormOpen(true);
  };

  const onOpenEdit = (investment: InvestmentDto) => {
    setFormMode('edit');
    setActiveInvestmentId(investment.id);
    setFormValues(toFormValues(investment));
    setFormError(null);
    setPageError(null);
    setFormOpen(true);
  };

  const onCloseForm = () => {
    if (createMutation.isPending || updateMutation.isPending) {
      return;
    }
    setFormOpen(false);
    setFormError(null);
  };

  const onSubmit = async () => {
    const validationError = getValidationError(formValues, t);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError(null);
    setPageError(null);

    try {
      if (formMode === 'create') {
        await createMutation.mutateAsync(formValues);
      } else if (activeInvestmentId) {
        await updateMutation.mutateAsync({ investmentId: activeInvestmentId, values: formValues });
      }
    } catch (error) {
      const fallback =
        formMode === 'create' ? t('investments.errors.create') : t('investments.errors.update');
      if (error instanceof Error) {
        setPageError(error.message || fallback);
      } else {
        setPageError(fallback);
      }
    }
  };

  const onDelete = async (investmentId: string) => {
    setPageError(null);
    try {
      await deleteMutation.mutateAsync(investmentId);
    } catch (error) {
      if (error instanceof Error) {
        setPageError(error.message || t('investments.errors.delete'));
      } else {
        setPageError(t('investments.errors.delete'));
      }
    }
  };

  const investments = investmentsQuery.data?.data ?? [];
  const tableRows = useMemo(
    () =>
      investments.map((investment) => {
        const quantity = toNumber(investment.quantity);
        const purchasePrice = toNumber(investment.purchasePrice);
        const currentPrice = toNumber(investment.currentPrice);

        return {
          ...investment,
          quantity,
          purchasePrice,
          currentPrice,
          investedValue: quantity * purchasePrice,
          currentValue: quantity * currentPrice,
        };
      }),
    [investments]
  );

  const loading = portfoliosQuery.isLoading || investmentsQuery.isLoading;
  const mutationBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4">{t('investments.title')}</Typography>
            <Typography color="text.secondary">{t('investments.subtitle')}</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
            <FormControl size="small" sx={{ width: { xs: '100%', sm: 260 }, minWidth: 0 }}>
              <InputLabel id="portfolio-select-label">{t('common.labels.portfolio')}</InputLabel>
              <Select
                labelId="portfolio-select-label"
                value={selectedPortfolioId}
                label={t('common.labels.portfolio')}
                onChange={(event) => setSelectedPortfolioId(event.target.value)}
              >
                {(portfoliosQuery.data?.data ?? []).map((portfolio) => (
                  <MenuItem key={portfolio.id} value={portfolio.id}>
                    {portfolio.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={onOpenCreate}
              disabled={!selectedPortfolioId || loading}
              sx={{ width: { xs: '100%', sm: 'auto' }, minHeight: 40 }}
            >
              {t('common.actions.addInvestment')}
            </Button>
          </Box>
        </Box>

        {(pageError || portfoliosQuery.error || investmentsQuery.error) && (
          <Alert severity="error">
            {pageError || t('investments.errors.loadData')}
          </Alert>
        )}

        <Paper variant="outlined">
          {isMobile ? (
            <Stack spacing={1.25} sx={{ p: 1.5 }}>
              {!loading && tableRows.length === 0 ? (
                <Typography color="text.secondary">{t('investments.empty.noRows')}</Typography>
              ) : (
                tableRows.map((row) => (
                  <Card key={row.id} variant="outlined">
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Stack spacing={1.25}>
                        <Box>
                          <Typography variant="subtitle2">{row.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t(`investments.assetTypes.${row.assetType}`)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                            gap: 1,
                          }}
                        >
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {t('common.labels.quantity')}
                            </Typography>
                            <Typography variant="body2">{row.quantity.toFixed(2)}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {t('common.labels.purchasePrice')}
                            </Typography>
                            <Typography variant="body2">{formatCurrency(row.purchasePrice, locale)}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {t('common.labels.currentPrice')}
                            </Typography>
                            <Typography variant="body2">{formatCurrency(row.currentPrice, locale)}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {t('common.labels.investedValue')}
                            </Typography>
                            <Typography variant="body2">{formatCurrency(row.investedValue, locale)}</Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t('common.labels.currentValue')}
                          </Typography>
                          <Typography variant="body2">{formatCurrency(row.currentValue, locale)}</Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Button
                            fullWidth
                            size="small"
                            onClick={() => onOpenEdit(row)}
                            sx={{ minHeight: 36 }}
                          >
                            {t('common.actions.edit')}
                          </Button>
                          <Button
                            fullWidth
                            size="small"
                            color="error"
                            onClick={() => onDelete(row.id)}
                            disabled={deleteMutation.isPending}
                            sx={{ minHeight: 36 }}
                          >
                            {t('common.actions.delete')}
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>
          ) : (
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 920 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('common.labels.name')}</TableCell>
                    <TableCell>{t('common.labels.assetType')}</TableCell>
                    <TableCell align="right">{t('common.labels.quantity')}</TableCell>
                    <TableCell align="right">{t('common.labels.purchasePrice')}</TableCell>
                    <TableCell align="right">{t('common.labels.currentPrice')}</TableCell>
                    <TableCell align="right">{t('common.labels.investedValue')}</TableCell>
                    <TableCell align="right">{t('common.labels.currentValue')}</TableCell>
                    <TableCell align="right">{t('common.labels.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!loading && tableRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Typography color="text.secondary">{t('investments.empty.noRows')}</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {tableRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{t(`investments.assetTypes.${row.assetType}`)}</TableCell>
                      <TableCell align="right">{row.quantity.toFixed(2)}</TableCell>
                      <TableCell align="right">{formatCurrency(row.purchasePrice, locale)}</TableCell>
                      <TableCell align="right">{formatCurrency(row.currentPrice, locale)}</TableCell>
                      <TableCell align="right">{formatCurrency(row.investedValue, locale)}</TableCell>
                      <TableCell align="right">{formatCurrency(row.currentValue, locale)}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Button size="small" onClick={() => onOpenEdit(row)} sx={{ minHeight: 36 }}>
                            {t('common.actions.edit')}
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => onDelete(row.id)}
                            disabled={deleteMutation.isPending}
                            sx={{ minHeight: 36 }}
                          >
                            {t('common.actions.delete')}
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      <Dialog
        open={formOpen}
        onClose={onCloseForm}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
        slotProps={{
          paper: {
            sx: {
              m: { xs: 0, sm: 2 },
            },
          },
        }}
      >
        <DialogTitle>
          {formMode === 'create' ? t('investments.dialog.addTitle') : t('investments.dialog.editTitle')}
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {formError && <Alert severity="warning">{formError}</Alert>}

            <FormControl fullWidth>
              <InputLabel id="form-portfolio-label">{t('common.labels.portfolio')}</InputLabel>
              <Select
                labelId="form-portfolio-label"
                label={t('common.labels.portfolio')}
                value={formValues.portfolioId}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    portfolioId: event.target.value,
                  }))
                }
              >
                {(portfoliosQuery.data?.data ?? []).map((portfolio) => (
                  <MenuItem key={portfolio.id} value={portfolio.id}>
                    {portfolio.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label={t('common.labels.name')}
              value={formValues.name}
              onChange={(event) => setFormValues((prev) => ({ ...prev, name: event.target.value }))}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel id="asset-type-label">{t('common.labels.assetType')}</InputLabel>
              <Select
                labelId="asset-type-label"
                value={formValues.assetType}
                label={t('common.labels.assetType')}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    assetType: event.target.value as AssetTypeType,
                  }))
                }
              >
                {assetTypeOptions.map((assetType) => (
                  <MenuItem key={assetType} value={assetType}>
                    {t(`investments.assetTypes.${assetType}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label={t('common.labels.quantity')}
              type="number"
              value={formValues.quantity}
              onChange={(event) => setFormValues((prev) => ({ ...prev, quantity: event.target.value }))}
              fullWidth
              slotProps={{ htmlInput: { min: 0, step: '0.0001' } }}
            />

            <TextField
              label={t('common.labels.purchasePrice')}
              type="number"
              value={formValues.purchasePrice}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, purchasePrice: event.target.value }))
              }
              fullWidth
              slotProps={{ htmlInput: { min: 0, step: '0.0001' } }}
            />

            <TextField
              label={t('common.labels.currentPrice')}
              type="number"
              value={formValues.currentPrice}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, currentPrice: event.target.value }))
              }
              fullWidth
              slotProps={{ htmlInput: { min: 0, step: '0.0001' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2 }, flexWrap: 'wrap', gap: 1 }}>
          <Button onClick={onCloseForm} disabled={mutationBusy}>
            {t('common.actions.cancel')}
          </Button>
          <Button onClick={onSubmit} variant="contained" disabled={mutationBusy} sx={{ minWidth: 96 }}>
            {formMode === 'create' ? t('common.actions.create') : t('common.actions.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
