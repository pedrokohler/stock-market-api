import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { QuoteService } from 'src/app/services/quote.service';
import { ProcessedQuote, processedQuoteInitialValues } from 'src/app/interfaces/ProcessedQuote.interface';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'tr[app-quote-item]',
  templateUrl: './quote-item.component.html',
  styleUrls: ['./quote-item.component.css']
})
export class QuoteItemComponent implements OnInit, OnDestroy{
  @Input() quote: ProcessedQuote = processedQuoteInitialValues;
  @Output() onDeleteQuote: EventEmitter<ProcessedQuote> = new EventEmitter();
  timerSubscription: Subscription = new Subscription();
  faTimes = faTimes;

  constructor(private quoteService: QuoteService) {}

  ngOnInit(): void {
    this.quoteService.onSettingsChanged().subscribe(_ => this.resetTriggers())
    this.triggerNextPolling();
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }

  triggerNextPolling(){
    this.timerSubscription = timer(this.quote.pollingInterval).subscribe(_ => this.updateQuote.bind(this)());
  }

  updateQuote() {
    const observable =  this.quoteService.refreshQuote(this.quote);
    observable.subscribe(quote => {
      this.quote = quote;
      this.triggerNextPolling();
    });
    return observable;
  }

  resetTriggers() {
    this.timerSubscription.unsubscribe();
    this.updateQuote();
  }

  onDelete(){
    this.onDeleteQuote.emit();
  }
}
