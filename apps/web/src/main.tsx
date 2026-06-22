import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './auth/init-auth';
import './i18n';
import { App } from './app/App';
import { AppProviders } from './providers/AppProviders';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProviders>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProviders>
  </React.StrictMode>
);
