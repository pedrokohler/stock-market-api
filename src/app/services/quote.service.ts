import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { QuoteAdapter } from 'src/app/adapters/quote.adapter';
import { Quote } from 'src/app/interfaces/Quote';
import { QUOTES } from 'src/app/quotes.mock';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  constructor() { }

  getQuotes(): Observable<Quote[]> {
    const quotes = [ "AAPL", "GOLD", "NEM", "FEM" ].map((symbol, i) => new QuoteAdapter(symbol, QUOTES[i]));
    const observableQuotes = of(quotes);
    return observableQuotes;
  }
}
