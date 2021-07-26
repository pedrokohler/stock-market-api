import { Component, OnInit } from '@angular/core';
import { Quote } from 'src/app/interfaces/Quote';
import { QuoteService } from 'src/app/services/quote.service';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {
  quotes: Quote[] = [];

  constructor(private quoteService: QuoteService) { }

  ngOnInit(): void {
    this.quoteService.getQuotes().subscribe(quotes => this.quotes = quotes);
  }

}
