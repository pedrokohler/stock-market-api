import { Injectable } from '@angular/core';
import { Settings } from './quote.service';

const LOCAL_STORAGE_URLS_KEY = 'stock-market-api:urls';
const LOCAL_STORAGE_SETTINGS_KEY = 'stock-market-api:settings';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setStoredUrls(urls: string[]): void{
    localStorage.setItem(LOCAL_STORAGE_URLS_KEY, JSON.stringify(urls));
  }

  setStoredSettings(data: {
    highFrequencyPollingInterval: number,
    lowFrequencyPollingInterval: number,
    changePercentageThreshold: number,
  }) {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(data));
  }

  getStoredUrls(): string[] {
    const storedData = localStorage.getItem(LOCAL_STORAGE_URLS_KEY) || "[]";
    return JSON.parse(storedData);
  }

  getStoredSettings(): Settings {
    const storedData = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY) || "{}";
    return JSON.parse(storedData);
  }

  addUrl(url: string): void {
    const oldStoredItems = this.getStoredUrls();
    localStorage.setItem(LOCAL_STORAGE_URLS_KEY, JSON.stringify([...oldStoredItems, url]));
  }
}
