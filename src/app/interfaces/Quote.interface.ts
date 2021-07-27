export interface Quote {
  url: string;
  symbol: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  currentPrice: number;
  previousClosePrice: number;
  pollingTimestamp: number;
  lastPrice: number;
}