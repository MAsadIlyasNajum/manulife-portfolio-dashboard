import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n';

export function LanguageSwitcher() {
    const { i18n, t } = useTranslation();

    const onLanguageChange = (_event: MouseEvent<HTMLElement>, language: SupportedLanguage | null) => {
        if (!language || language === i18n.language) {
            return;
        }

        void i18n.changeLanguage(language);
    };

    const activeLanguage: SupportedLanguage =
        i18n.language.startsWith('bm') || i18n.language.startsWith('ms') ? 'bm' : 'en';

    return (
        <ToggleButtonGroup
            size="small"
            value={activeLanguage}
            exclusive
            onChange={onLanguageChange}
            aria-label={t('language.switch')}
            sx={{ height: 36 }}
        >
            {SUPPORTED_LANGUAGES.map((language) => (
                <ToggleButton key={language} value={language} sx={{ px: 1.5, fontWeight: 600 }}>
                    {t(`language.${language}`)}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}
