import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/services/ui.service';
import { QuoteService } from 'src/app/services/quote.service';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.css']
})
export class SettingsFormComponent implements OnInit {
  highFrequencyPollingInterval: number = 0;
  lowFrequencyPollingInterval: number = 0;
  changePercentageThreshold: number = 0;
  isVisible: Boolean = false;
  subscription: Subscription = new Subscription();

  constructor(private uiService: UiService, private quoteService: QuoteService) { }

  ngOnInit(): void {
    this.quoteService.initializeSettings();
    this.highFrequencyPollingInterval = this.quoteService.highFrequencyPollingInterval / 1000;
    this.lowFrequencyPollingInterval = this.quoteService.lowFrequencyPollingInterval / 1000;
    this.changePercentageThreshold = this.quoteService.changePercentageThreshold;
    this.subscription = this.uiService.onToggle().subscribe(value => this.isVisible = value);
  }

  onSubmit() {
    this.quoteService.configure({
      highFrequencyPollingInterval: this.highFrequencyPollingInterval * 1000,
      lowFrequencyPollingInterval: this.lowFrequencyPollingInterval * 1000,
      changePercentageThreshold: this.changePercentageThreshold,
    });
  }
}
