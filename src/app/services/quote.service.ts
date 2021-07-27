import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { parseSymbol } from "src/app/common/parseSymbol";
import { quoteAdapter } from 'src/app/adapters/quote.adapter';
import { ProcessedQuote } from 'src/app/interfaces/ProcessedQuote.interface';
import { QuoteResponse } from 'src/app/dtos/QuoteResponse.dto';
import { LocalStorageService } from './local-storage.service';
import { Quote } from 'src/app/interfaces/Quote.interface';

export interface Settings {
    highFrequencyPollingInterval: number,
    lowFrequencyPollingInterval: number,
    changePercentageThreshold: number,
}

const INITIAL_HIGH_FREQUENCY_POLLING_INTERVAL = 2 * 1000;
const INITIAL_LOW_FREQUENCY_POLLING_INTERVAL = 15 * 1000;
const INITIAL_CHANGE_PERCENTAGE_THRESHOLD = 3;
@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  public highFrequencyPollingInterval: number = INITIAL_HIGH_FREQUENCY_POLLING_INTERVAL;
  public lowFrequencyPollingInterval: number = INITIAL_LOW_FREQUENCY_POLLING_INTERVAL;
  public changePercentageThreshold: number = INITIAL_CHANGE_PERCENTAGE_THRESHOLD;
  private subject: Subject<null> = new Subject<null>();

  constructor(private http: HttpClient, private storageService: LocalStorageService) { }

  initializeQuotes(urls: string[]): Observable<ProcessedQuote[]> {
    const quotes = urls.map(url => this.fetchQuote.bind(this)(url));
    return forkJoin(quotes);
  }

  initializeSettings(){
    const {
      highFrequencyPollingInterval,
      lowFrequencyPollingInterval,
      changePercentageThreshold,
    } = this.storageService.getStoredSettings();

    this.highFrequencyPollingInterval = highFrequencyPollingInterval || INITIAL_HIGH_FREQUENCY_POLLING_INTERVAL;
    this.lowFrequencyPollingInterval = lowFrequencyPollingInterval || INITIAL_LOW_FREQUENCY_POLLING_INTERVAL;
    this.changePercentageThreshold = changePercentageThreshold || INITIAL_CHANGE_PERCENTAGE_THRESHOLD;
  }

  deleteQuote(quotes: ProcessedQuote[], quoteToDelete: ProcessedQuote): ProcessedQuote[] {
    const remainingQuotes = quotes.filter(quote => quote.url !== quoteToDelete.url);
    this.storageService.setStoredUrls(remainingQuotes.map(quote => quote.url));
    return remainingQuotes;
  }

  addQuote(quotes: ProcessedQuote[], url: string): Observable<ProcessedQuote[]> {
    const isNewSymbol = !Boolean(quotes.find(quote => quote.url === url));
    if(isNewSymbol){
      const newQuotes = this.fetchQuote(url)
        .pipe(
          map(newQuote => [...quotes, newQuote])
        );
      this.storageService.addUrl(url);
      return newQuotes;
    }
    const oldQuotes = of(quotes);
    return oldQuotes;
  }

  updateQuote(quote: ProcessedQuote): Observable<ProcessedQuote> {
    const newQuote = this.fetchQuote(quote.url, quote.currentPrice);
    return newQuote;
  }

  calculatePollingInterval(changePercentage: number): number {
    return changePercentage > this.changePercentageThreshold
      ? this.highFrequencyPollingInterval
      : this.lowFrequencyPollingInterval
  }

  fetchQuote(url: string, lastPrice?: number): Observable<ProcessedQuote> {
    return this.http
      .get<QuoteResponse>(url)
      .pipe(
        map(this.normalizeQuote(url, lastPrice))
      );
  }

  normalizeQuote(url: string, lastPrice?: number) {
    return (quoteResponse: QuoteResponse) => {
      const quote = quoteAdapter(quoteResponse);
      const processedQuote = this.processQuote(url, quote, lastPrice);
      return processedQuote;
    }
  }

  processQuote(url: string, quote: Quote, lastPrice?: number): ProcessedQuote{
    const { currentPrice } = quote;
    const lastPriceConsidered = lastPrice || currentPrice;
    const changePercentage = (Math.abs(lastPriceConsidered - currentPrice) / lastPriceConsidered) * 100;
    const pollingInterval = this.calculatePollingInterval(changePercentage);
    return {
      ...quote,
      url: url,
      symbol: parseSymbol(url),
      lastPrice: lastPriceConsidered,
      pollingInterval,
      changePercentage: 1,
    }
  }

  configure(data: Settings): void{
    this.highFrequencyPollingInterval = data.highFrequencyPollingInterval,
    this.lowFrequencyPollingInterval = data.lowFrequencyPollingInterval,
    this.changePercentageThreshold = data.changePercentageThreshold,
    this.storageService.setStoredSettings(data)
    this.subject.next(null);
  }

  onSettingsChanged(): Observable<any> {
    return this.subject.asObservable();
  }
}
