import { Component, OnInit } from '@angular/core';
import { Quote } from 'src/app/interfaces/Quote.interface';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { QuoteService } from 'src/app/services/quote.service';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {
  initialUrls: string[] = [];
  quotes: Quote[] = [];

  constructor(private quoteService: QuoteService, private storageService: LocalStorageService) { }

  ngOnInit(): void {
    this.initialUrls = this.storageService.getStoredUrls();
    this.quoteService.initializeQuotes(this.initialUrls).subscribe(quotes => this.quotes = quotes);
  }

  deleteQuote(quote: Quote){
    this.quotes = this.quoteService.deleteQuote(this.quotes, quote);
  }

  addQuote(url: string) {
    this.quoteService.addQuote(this.quotes, url).subscribe(quotes => this.quotes = quotes);
  }
}
