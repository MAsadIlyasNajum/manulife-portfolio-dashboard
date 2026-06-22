import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  Container,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { authService } from '../api/services/auth.service';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { AUTH_SESSION_QUERY_KEY } from '../store/auth-store';
import { setAccessToken, setRefreshToken } from '../utils/token-storage';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);

  // Login state
  const [loginEmail, setLoginEmail] = useState('demo@manulife.com');
  const [loginPassword, setLoginPassword] = useState('Password123!');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginShowPassword, setLoginShowPassword] = useState(false);

  // Register state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
  const [registerShowPassword, setRegisterShowPassword] = useState(false);
  const [registerShowConfirm, setRegisterShowConfirm] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setLoginError(null);
    setRegisterError(null);
    setRegisterSuccess(null);
  };

  const getErrorMessage = (error: unknown, fallbackKey: string): string => {
    if (axios.isAxiosError(error)) {
      const responseMessage = (error.response?.data as { message?: string } | undefined)?.message;
      if (typeof responseMessage === 'string' && responseMessage.trim().length > 0) {
        return responseMessage;
      }
    }

    if (error instanceof Error && error.message.trim().length > 0) {
      return error.message;
    }

    return t(fallbackKey);
  };

  const validateLoginForm = (): boolean => {
    if (!loginEmail.trim()) {
      setLoginError(t('auth.errors.emailRequired'));
      return false;
    }
    if (!loginPassword.trim()) {
      setLoginError(t('auth.errors.passwordRequired'));
      return false;
    }
    return true;
  };

  const validateRegisterForm = (): boolean => {
    if (!registerEmail.trim()) {
      setRegisterError(t('auth.errors.emailRequired'));
      return false;
    }
    if (!registerPassword.trim()) {
      setRegisterError(t('auth.errors.passwordRequired'));
      return false;
    }
    if (!registerConfirmPassword.trim()) {
      setRegisterError(t('auth.errors.confirmPasswordRequired'));
      return false;
    }
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError(t('auth.errors.passwordMismatch'));
      return false;
    }
    if (registerPassword.length < 8) {
      setRegisterError(t('auth.errors.passwordMinLength'));
      return false;
    }
    return true;
  };

  const onLogin = async () => {
    if (!validateLoginForm()) return;

    try {
      setLoginLoading(true);
      setLoginError(null);

      const res = await authService.login({
        email: loginEmail,
        password: loginPassword,
      });

      // Log full response for debugging
      console.log('✅ Login Response:', {
        hasAccessToken: !!res.accessToken,
        hasRefreshToken: !!res.refreshToken,
        hasUser: !!res.user,
        user: res.user,
        accessTokenLength: res.accessToken?.length,
        refreshTokenLength: res.refreshToken?.length,
      });

      // Validate tokens exist
      if (!res.accessToken) {
        throw new Error(t('auth.errors.missingAccessToken'));
      }
      if (!res.refreshToken) {
        throw new Error(t('auth.errors.missingRefreshToken'));
      }

      // Store tokens ONLY via token-storage.ts
      setAccessToken(res.accessToken);
      setRefreshToken(res.refreshToken);

      console.log('LOGIN_USER', res.user);
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, res.user);
      console.log('QUERY_CACHE_USER', queryClient.getQueryData(AUTH_SESSION_QUERY_KEY));

      console.log('✅ Tokens persisted to storage');

      // Navigate after token persistence
      navigate('/app/dashboard');
    } catch (e) {
      const errorMsg = getErrorMessage(e, 'auth.errors.invalidCredentials');
      console.error('❌ Login Error:', { error: errorMsg, details: e });
      setLoginError(errorMsg);
    } finally {
      setLoginLoading(false);
    }
  };

  const onRegister = async () => {
    if (!validateRegisterForm()) return;

    try {
      setRegisterLoading(true);
      setRegisterError(null);
      setRegisterSuccess(null);

      const emailForLoginPrefill = registerEmail;

      await authService.register({
        email: registerEmail,
        password: registerPassword,
      });

      setRegisterSuccess(t('auth.register.success'));
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');

      // Switch to login tab shortly after success while preserving user feedback.
      setTimeout(() => {
        setTabValue(0);
        setLoginEmail(emailForLoginPrefill);
        setRegisterSuccess(null);
      }, 1000);
    } catch (e) {
      const errorMsg = getErrorMessage(e, 'auth.errors.registrationFailed');
      setRegisterError(errorMsg);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleLoginKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loginLoading) {
      onLogin();
    }
  };

  const handleRegisterKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !registerLoading) {
      onRegister();
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          py: { xs: 1.5, sm: 2 },
        }}
      >
        <Card
          sx={{
            width: '100%',
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, pt: 2 }}>
              <LanguageSwitcher />
            </Box>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label={t('auth.tabs.login')} />
              <Tab label={t('auth.tabs.register')} />
            </Tabs>
          </Box>

          <Box sx={{ p: { xs: 2, sm: 4 } }}>
            {/* Login Tab */}
            <TabPanel value={tabValue} index={0}>
              <Typography
                variant="h5"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: '#1a1a1a',
                }}
              >
                {t('auth.login.title')}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: '#666',
                }}
              >
                {t('auth.login.subtitle')}
              </Typography>

              {loginError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {loginError}
                </Alert>
              )}

              <TextField
                fullWidth
                label={t('common.labels.emailAddress')}
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                onKeyPress={handleLoginKeyPress}
                disabled={loginLoading}
                margin="normal"
                variant="outlined"
                placeholder={t('auth.login.emailPlaceholder')}
                autoComplete="email"
              />

              <TextField
                fullWidth
                label={t('common.labels.password')}
                type={loginShowPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyPress={handleLoginKeyPress}
                disabled={loginLoading}
                margin="normal"
                variant="outlined"
                placeholder="••••••••"
                autoComplete="current-password"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setLoginShowPassword(!loginShowPassword)}
                          disabled={loginLoading}
                          tabIndex={-1}
                        >
                          {loginShowPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 2,
                  color: '#999',
                  fontStyle: 'italic',
                }}
              >
                {t('auth.login.demoHint')}
              </Typography>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={onLogin}
                disabled={loginLoading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                {loginLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    {t('auth.login.signingIn')}
                  </>
                ) : (
                  t('common.actions.signIn')
                )}
              </Button>
            </TabPanel>

            {/* Register Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography
                variant="h5"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: '#1a1a1a',
                }}
              >
                {t('auth.register.title')}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: '#666',
                }}
              >
                {t('auth.register.subtitle')}
              </Typography>

              {registerError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {registerError}
                </Alert>
              )}

              {registerSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {registerSuccess}
                </Alert>
              )}

              <TextField
                fullWidth
                label={t('common.labels.emailAddress')}
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                onKeyPress={handleRegisterKeyPress}
                disabled={registerLoading}
                margin="normal"
                variant="outlined"
                placeholder={t('auth.register.emailPlaceholder')}
                autoComplete="email"
              />

              <TextField
                fullWidth
                label={t('common.labels.password')}
                type={registerShowPassword ? 'text' : 'password'}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                onKeyPress={handleRegisterKeyPress}
                disabled={registerLoading}
                margin="normal"
                variant="outlined"
                placeholder="••••••••"
                helperText={t('auth.register.helperPasswordLength')}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setRegisterShowPassword(!registerShowPassword)}
                          disabled={registerLoading}
                          tabIndex={-1}
                        >
                          {registerShowPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                fullWidth
                label={t('common.labels.confirmPassword')}
                type={registerShowConfirm ? 'text' : 'password'}
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                onKeyPress={handleRegisterKeyPress}
                disabled={registerLoading}
                margin="normal"
                variant="outlined"
                placeholder="••••••••"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setRegisterShowConfirm(!registerShowConfirm)}
                          disabled={registerLoading}
                          tabIndex={-1}
                        >
                          {registerShowConfirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={onRegister}
                disabled={registerLoading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                {registerLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    {t('auth.register.creatingAccount')}
                  </>
                ) : (
                  t('common.actions.createAccount')
                )}
              </Button>
            </TabPanel>
          </Box>
        </Card>
      </Box>
    </Container>
  );
}