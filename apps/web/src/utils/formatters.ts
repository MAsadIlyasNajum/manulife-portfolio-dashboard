export function formatCurrency(value: number, locale = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
    }).format(value);
}

export function formatPercentage(value: number, locale = 'en-US'): string {
    return `${new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)}%`;
}

export function formatNumber(value: number, locale = 'en-US'): string {
    return new Intl.NumberFormat(locale).format(value);
}