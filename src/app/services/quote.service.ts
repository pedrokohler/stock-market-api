import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators'
import { QuoteAdapter } from 'src/app/adapters/quote.adapter';
import { Quote } from 'src/app/interfaces/Quote';
import { QuoteResponse } from '../interfaces/QuoteResponse.dto';

const LOCAL_STORAGE_URL_KEY = 'stock-market-api:urls';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  constructor(private http: HttpClient) { }

  initializeQuotes(urls: string[]): Observable<Quote[]> {
    const quotes = urls.map(this.fetchQuote.bind(this));
    return forkJoin(quotes);
  }

  deleteQuote(quotes: Quote[], quoteToDelete: Quote): Quote[] {
    const remainingQuotes = quotes.filter(quote => quote.url !== quoteToDelete.url);
    localStorage.setItem(LOCAL_STORAGE_URL_KEY, JSON.stringify(remainingQuotes.map(quote => quote.url)));
    return remainingQuotes;
  }

  getLocalStorageUrls(): string[] {
    const storedData = localStorage.getItem(LOCAL_STORAGE_URL_KEY) || "[]";
    return JSON.parse(storedData);
  }

  addQuote(quotes: Quote[], url: string): Observable<Quote[]> {
    const isNewSymbol = !Boolean(quotes.find(quote => quote.url === url));
    const oldQuotes = of(quotes);
    if(isNewSymbol){
      const newQuotes = this.fetchQuote(url)
        .pipe(map(newQuote => [...quotes, newQuote]));
      const oldSavedItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_URL_KEY) || "[]");
      localStorage.setItem(LOCAL_STORAGE_URL_KEY, JSON.stringify([...oldSavedItems, url]));
      return newQuotes;
    }
    return oldQuotes;
  }

  fetchQuote(url: string): Observable<Quote> {
    return this.http
      .get<QuoteResponse>(url)
      .pipe(
        map((response) => new QuoteAdapter(url, response))
      );
  }
}
