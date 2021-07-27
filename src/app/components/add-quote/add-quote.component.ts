import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { isUri } from 'valid-url';
import { QuoteAdapter } from 'src/app/adapters/quote.adapter';

@Component({
  selector: 'app-add-quote',
  templateUrl: './add-quote.component.html',
  styleUrls: ['./add-quote.component.css']
})
export class AddQuoteComponent implements OnInit {
  @Output() onAddQuote: EventEmitter<string> = new EventEmitter();
  url: string = "";

  constructor() { }

  ngOnInit(): void {}

  onSubmit() {
    if(!this.isValidUrl(this.url)){
      // @todo: add error dialog
      alert("Invalid Uri");
      return;
    }
    this.onAddQuote.emit(this.url);
    this.url = "";
  }

  isValidUrl(url: string){
    const hasSymbolMatch = QuoteAdapter.matchSymbolRegex.test(url);
    return isUri(url) && hasSymbolMatch;
  }
}
