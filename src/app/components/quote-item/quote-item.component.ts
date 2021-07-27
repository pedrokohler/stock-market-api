import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { timer } from 'rxjs';
import { QuoteService } from 'src/app/services/quote.service';
import { Quote, quoteInitialValues } from 'src/app/interfaces/Quote.interface';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-quote-item',
  templateUrl: './quote-item.component.html',
  styleUrls: ['./quote-item.component.css']
})
export class QuoteItemComponent implements OnInit {
  @Input() quote: Quote = quoteInitialValues;
  @Output() onDeleteQuote: EventEmitter<Quote> = new EventEmitter();
  faTimes = faTimes;

  constructor(private quoteService: QuoteService) {}

  ngOnInit(): void {
    this.triggerNextPolling();
  }

  triggerNextPolling(){
    return timer(this.quote.pollingInterval).subscribe(_ => this.updateQuote.bind(this)())
  }

  updateQuote() {
    const observable =  this.quoteService.updateQuote(this.quote);
    observable.subscribe(quote => {
      this.quote = quote;
      this.triggerNextPolling();
    });
    return observable;
  }

  onDelete(){
    this.onDeleteQuote.emit();
  }
}
