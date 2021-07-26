import { Quote } from "../interfaces/Quote";
import { QuoteResponse } from "../interfaces/QuoteResponse.dto";

export class QuoteAdapter implements Quote {
  public url: string;
  public symbol: string;
  public openPrice: number;
  public highPrice: number;
  public lowPrice: number;
  public currentPrice: number;
  public previousClosePrice: number;
  public pollingTimestamp: number;

  constructor(url: string, quoteResponse: QuoteResponse){
    const { o, h, l, c, pc, t } = quoteResponse;
    this.url = url,
    this.symbol = this.parseSymbol(url);
    this.openPrice = o;
    this.highPrice = h;
    this.lowPrice = l;
    this.currentPrice = c;
    this.previousClosePrice = pc;
    this.pollingTimestamp = t;
  }

  public parseSymbol(url: string): string{
    return url.replace(/^.*\?symbol=([^&]{1,}).*$/, "$1") || "Unable to parse symbol";
  }
}