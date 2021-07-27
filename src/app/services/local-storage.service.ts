import { Injectable } from '@angular/core';

const LOCAL_STORAGE_URL_KEY = 'stock-market-api:urls';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setStoredUrls(urls: string[]): void{
    localStorage.setItem(LOCAL_STORAGE_URL_KEY, JSON.stringify(urls));
  }

  getStoredUrls(): string[] {
    const storedData = localStorage.getItem(LOCAL_STORAGE_URL_KEY) || "[]";
    return JSON.parse(storedData);
  }

  addUrl(url: string): void {
    const oldStoredItems = this.getStoredUrls();
    localStorage.setItem(LOCAL_STORAGE_URL_KEY, JSON.stringify([...oldStoredItems, url]));
  }
}
