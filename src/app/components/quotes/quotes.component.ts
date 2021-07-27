import { Component, OnInit } from '@angular/core';
import { Quote } from 'src/app/interfaces/Quote';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { QuoteService } from 'src/app/services/quote.service';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {
  urls: string[] = [];
  quotes: Quote[] = [];

  constructor(private quoteService: QuoteService, private storageService: LocalStorageService) { }

  ngOnInit(): void {
    this.urls = this.storageService.getStoredUrls();
    this.quoteService.initializeQuotes(this.urls).subscribe(quotes => this.quotes = quotes);
  }

  deleteQuote(quote: Quote){
    this.quotes = this.quoteService.deleteQuote(this.quotes, quote);
  }

  addQuote(url: string) {
    this.quoteService.addQuote(this.quotes, url).subscribe(quotes => this.quotes = quotes);
  }
}
