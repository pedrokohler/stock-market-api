import { Quote } from "../interfaces/Quote";
import { QuoteResponse } from "../interfaces/QuoteResponse.dto";

export class QuoteAdapter implements Quote {
  public symbol: string;
  public openPrice: number;
  public highPrice: number;
  public lowPrice: number;
  public currentPrice: number;
  public previousClosePrice: number;
  public pollingTimestamp: number;

  constructor(symbol: string, quoteResponse: QuoteResponse){
    const { o, h, l, c, pc, t } = quoteResponse;
    this.symbol = symbol;
    this.openPrice = o;
    this.highPrice = h;
    this.lowPrice = l;
    this.currentPrice = c;
    this.previousClosePrice = pc;
    this.pollingTimestamp = t;
  }
}