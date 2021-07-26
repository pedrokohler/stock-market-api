import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators'
import { QuoteAdapter } from 'src/app/adapters/quote.adapter';
import { Quote } from 'src/app/interfaces/Quote';
import { QUOTES } from 'src/app/quotes.mock';
import { QuoteResponse } from '../interfaces/QuoteResponse.dto';

const LOCAL_STORAGE_URL_KEY = 'stock-market-api:urls';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  constructor(private http: HttpClient) { }

  initializeQuotes(urls: string[]): Observable<Quote[]> {
    const symbols = urls.map(this.parseSymbol);
    const requests = urls
      .map((url, i) => this.http
        .get<QuoteResponse>(url)
        .pipe(map((response) => new QuoteAdapter(symbols[i], response)))
      );
    return forkJoin(requests);
  }

  getLocalStorageUrls(): string[] {
    const storedData = localStorage.getItem(LOCAL_STORAGE_URL_KEY) || "[]";
    return JSON.parse(storedData);
  }

  parseSymbol(url: string){
    return url.replace(/^.*\?symbol=([^&]{1,}).*$/, "$1") || "Unable to parse symbol";
  }
}
