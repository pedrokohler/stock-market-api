import { Component, OnInit } from '@angular/core';
import { Quote } from 'src/app/interfaces/Quote';
import { QuoteService } from 'src/app/services/quote.service';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {
  urls: string[] = [];
  quotes: Quote[] = [];

  constructor(private quoteService: QuoteService) { }

  ngOnInit(): void {
    this.urls = this.quoteService.getLocalStorageUrls();
    this.quoteService.initializeQuotes(this.urls).subscribe(quotes => this.quotes = quotes);
  }

  deleteQuote(quote: Quote){
    this.quotes = this.quoteService.deleteQuote(this.quotes, quote);
  }
}
