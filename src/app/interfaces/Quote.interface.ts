export interface Quote {
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  currentPrice: number;
  previousClosePrice: number;
  pollingTimestamp: number;
}

export const quoteInitialValues: Quote = {
  openPrice: 0,
  highPrice: 0,
  lowPrice: 0,
  currentPrice: 0,
  previousClosePrice:0,
  pollingTimestamp: 0,
}