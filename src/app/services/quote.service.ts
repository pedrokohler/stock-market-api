import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators'
import { quoteAdapter } from 'src/app/adapters/quote.adapter';
import { Quote } from 'src/app/interfaces/Quote.interface';
import { QuoteResponse } from '../dtos/QuoteResponse.dto';
import { LocalStorageService } from './local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  static highFrequencyPollingInterval: number = 2000;
  static lowFrequencyPollingInterval: number = 15000;
  static changePercentageThreshold: number = 3;
  constructor(private http: HttpClient, private storageService: LocalStorageService) { }

  initializeQuotes(urls: string[]): Observable<Quote[]> {
    const quotes = urls.map(url => this.fetchQuote.bind(this)(url));
    return forkJoin(quotes);
  }

  deleteQuote(quotes: Quote[], quoteToDelete: Quote): Quote[] {
    const remainingQuotes = quotes.filter(quote => quote.url !== quoteToDelete.url);
    this.storageService.setStoredUrls(remainingQuotes.map(quote => quote.url));
    return remainingQuotes;
  }

  addQuote(quotes: Quote[], url: string): Observable<Quote[]> {
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

  updateQuote(quote: Quote): Observable<Quote> {
    const newQuote = this.fetchQuote(quote.url, quote.currentPrice);
    return newQuote;
  }

  calculatePollingInterval(currentPrice: number, lastPrice: number): number {
    const changePercentage = (Math.abs(lastPrice - currentPrice) / lastPrice) * 100;
    return changePercentage > QuoteService.changePercentageThreshold
      ? QuoteService.highFrequencyPollingInterval
      : QuoteService.lowFrequencyPollingInterval
  }

  fetchQuote(url: string, lastPrice?: number): Observable<Quote> {
    return this.http
      .get<QuoteResponse>(url)
      .pipe(
        map(this.normalizeQuote(url, lastPrice))
      );
  }

  normalizeQuote(url: string, lastPrice?: number) {
    return (quoteResponse: QuoteResponse) => {
      const currentPrice = quoteResponse.c;
      const lastPriceConsidered = lastPrice || quoteResponse.c;
      const pollingInterval = this.calculatePollingInterval(currentPrice, lastPriceConsidered);
      return quoteAdapter({ url, quoteResponse, lastPrice, pollingInterval });
    }
  }
}
