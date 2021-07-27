import { Quote } from "src/app/interfaces/Quote.interface";
import { QuoteResponse } from "src/app/dtos/QuoteResponse.dto";

export function quoteAdapter (quoteResponse: QuoteResponse): Quote {
  const { o, h, l, c, pc, t } = quoteResponse;
  return {
    openPrice: o,
    highPrice: h,
    lowPrice: l,
    currentPrice: c,
    previousClosePrice: pc,
    pollingTimestamp: t,
  }
}