export interface Quote {
  symbol: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  currentPrice: number;
  previousClosePrice: number;
  pollingTimestamp: number;
}