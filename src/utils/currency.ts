export interface CurrencyInfo {
  code: string;
  symbol: string;
  label: string;
  rate: number;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'BDT', symbol: '৳', label: '৳ BDT', rate: 120 },
  { code: 'USD', symbol: '$', label: '$ USD', rate: 1 },
  { code: 'EUR', symbol: '€', label: '€ EUR', rate: 0.92 },
  { code: 'GBP', symbol: '£', label: '£ GBP', rate: 0.79 },
  { code: 'JPY', symbol: '¥', label: '¥ JPY', rate: 155 },
];

export const DEFAULT_CURRENCY = '৳';

export function getCurrencyInfo(symbolOrCode: string): CurrencyInfo {
  const cleanStr = symbolOrCode ? symbolOrCode.trim() : '৳';
  const found = CURRENCIES.find(
    (c) => c.symbol === cleanStr || c.code === cleanStr || c.label.includes(cleanStr)
  );
  return found || CURRENCIES[0];
}

export function formatPrice(basePriceInUSD: number, currencySymbolOrCode: string = '৳'): string {
  if (basePriceInUSD === undefined || basePriceInUSD === null || isNaN(basePriceInUSD)) {
    return '৳ 0';
  }
  const currency = getCurrencyInfo(currencySymbolOrCode);
  const converted = Math.round(basePriceInUSD * currency.rate);
  const formattedNumber = converted.toLocaleString();

  if (currency.code === 'BDT' || currency.symbol === '৳') {
    return `৳ ${formattedNumber}`;
  }
  return `${currency.symbol}${formattedNumber}`;
}
