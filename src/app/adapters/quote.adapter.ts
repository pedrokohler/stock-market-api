import { Quote } from "../interfaces/Quote.interface";
import { parseSymbol } from "src/app/common/parseSymbol";
import { QuoteResponse } from "src/app/dtos/QuoteResponse.dto";

interface QuoteAdapterInput {
  url: string;
  quoteResponse: QuoteResponse;
  lastPrice?: number;

}

export function quoteAdapter ({
  url,
  quoteResponse,
  lastPrice
}: QuoteAdapterInput): Quote {
  const { o, h, l, c, pc, t } = quoteResponse;
  return {
    url: url,
    symbol: parseSymbol(url),
    openPrice: o,
    highPrice: h,
    lowPrice: l,
    currentPrice: c,
    previousClosePrice: pc,
    pollingTimestamp: t,
    lastPrice: lastPrice || c,
  }
}