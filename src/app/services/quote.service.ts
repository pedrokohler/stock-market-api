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
  constructor(private http: HttpClient, private storageService: LocalStorageService) { }

  initializeQuotes(urls: string[]): Observable<Quote[]> {
    const quotes = urls.map(this.fetchQuote.bind(this));
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

  fetchQuote(url: string, lastPrice?: number): Observable<Quote> {
    return this.http
      .get<QuoteResponse>(url)
      .pipe(
        map((quoteResponse) => quoteAdapter({ url, quoteResponse, lastPrice }))
      );
  }
}
