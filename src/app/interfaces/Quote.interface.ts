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
  pollingInterval: number;
}

export const quoteInitialValues: Quote = {
  url: "",
  symbol: "",
  openPrice: 0,
  highPrice: 0,
  lowPrice: 0,
  currentPrice: 0,
  previousClosePrice:0,
  pollingTimestamp: 0,
  lastPrice: 0,
  pollingInterval: 0,
}