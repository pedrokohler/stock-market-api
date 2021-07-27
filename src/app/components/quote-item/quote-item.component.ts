import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Quote } from 'src/app/interfaces/Quote';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-quote-item',
  templateUrl: './quote-item.component.html',
  styleUrls: ['./quote-item.component.css']
})
export class QuoteItemComponent implements OnInit {
  @Input() quote: Quote | undefined;
  @Output() onDeleteQuote: EventEmitter<Quote> = new EventEmitter()
  faTimes = faTimes;

  constructor() {}

  ngOnInit(): void {}

  onDelete(){
    this.onDeleteQuote.emit();
  }
}
