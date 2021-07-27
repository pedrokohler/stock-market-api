import { Quote, quoteInitialValues } from "./Quote.interface";

export interface ProcessedQuote extends Quote {
  url: string;
  symbol: string,
  lastPrice: number,
  pollingInterval: number,
  changePercentage: number,
}

export const processedQuoteInitialValues: ProcessedQuote= {
  ...quoteInitialValues,
  url: "",
  symbol: "",
  lastPrice: 0,
  pollingInterval: 0,
  changePercentage: 0,
}