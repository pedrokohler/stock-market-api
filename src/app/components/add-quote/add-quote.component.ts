import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { matchSymbolRegex } from 'src/app/common/parseSymbol';
import { isUri } from 'valid-url';

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
    const hasSymbolMatch = matchSymbolRegex.test(url);
    return isUri(url) && hasSymbolMatch;
  }
}
