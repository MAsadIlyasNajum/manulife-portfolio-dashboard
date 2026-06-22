import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    Container,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { DashboardPage } from '../pages/DashboardPage';
import { InvestmentsPage } from '../pages/InvestmentsPage';
import { LoginPage } from '../pages/LoginPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { useAuthActions } from '../hooks/use-auth-actions';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

function AppArea() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, logoutState } = useAuthActions();

    const onLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    const navItems = [
        { label: t('app.nav.dashboard'), to: '/app/dashboard' },
        { label: t('app.nav.investments'), to: '/app/investments' },
        { label: t('app.nav.transactions'), to: '/app/transactions' },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="sticky" color="inherit" elevation={1}>
                <Toolbar
                    sx={{
                        gap: 1.5,
                        flexWrap: 'wrap',
                        px: { xs: 1.5, sm: 2 },
                        py: { xs: 1, sm: 0.75 },
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            flexGrow: 1,
                            minWidth: { xs: '100%', md: 'auto' },
                            fontSize: { xs: '1.05rem', sm: '1.25rem' },
                        }}
                    >
                        {t('app.title')}
                    </Typography>
                    <LanguageSwitcher />
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            flexWrap: { xs: 'nowrap', lg: 'wrap' },
                            overflowX: { xs: 'auto', lg: 'visible' },
                            pb: { xs: 0.5, lg: 0 },
                            width: { xs: '100%', md: 'auto' },
                            '&::-webkit-scrollbar': {
                                height: 6,
                            },
                        }}
                    >
                        {navItems.map((item) => (
                            <Button
                                key={item.to}
                                component={RouterLink}
                                to={item.to}
                                variant={location.pathname.startsWith(item.to) ? 'contained' : 'text'}
                                color="primary"
                                sx={{
                                    whiteSpace: 'nowrap',
                                    minHeight: 40,
                                    px: 2,
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Stack>
                    <Button
                        onClick={onLogout}
                        color="inherit"
                        disabled={logoutState.isPending}
                        sx={{
                            minHeight: 40,
                            width: { xs: '100%', md: 'auto' },
                        }}
                    >
                        {logoutState.isPending ? (
                            <CircularProgress size={20} />
                        ) : (
                            t('app.logout.idle')
                        )}
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="xl" disableGutters>
                <Outlet />
            </Container>
        </Box>
    );
}

export function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/app"
                element={
                    <ProtectedRoute>
                        <AppArea />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="investments" element={<InvestmentsPage />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
        </Routes>
    );
}
