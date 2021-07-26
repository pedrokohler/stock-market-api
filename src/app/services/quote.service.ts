import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin } from 'rxjs';
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
    const requests = urls
      .map((url) => this.http
        .get<QuoteResponse>(url)
        .pipe(map((response) => new QuoteAdapter(url, response)))
      );
    return forkJoin(requests);
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
}
