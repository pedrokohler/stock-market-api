import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


import { QuoteService } from './quote.service';
import { HttpClient } from '@angular/common/http';

describe('QuoteService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: QuoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuoteService]
    });
    service = TestBed.inject(QuoteService);
    httpTestingController = TestBed.get(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("Should normalize quotes without the last price", () => {
    const url = 'https://finnhub.io/api/v1/quote?symbol=GOLD&token=c3rc512ad3i88nmlp6r0';
    const responseQuote = {
      c: 148.99,
      h: 149.83,
      l: 147.7,
      o: 148.27,
      pc: 148.56,
      t: 1627329602,
    }
    const normalizedQuote = service.normalizeQuote(url)(responseQuote);
    expect(normalizedQuote).toEqual({
      symbol: 'GOLD',
      url,
      openPrice: responseQuote.o,
      highPrice: responseQuote.h,
      lowPrice: responseQuote.l,
      currentPrice: responseQuote.c,
      previousClosePrice: responseQuote.pc,
      pollingTimestamp: responseQuote.t,
      lastPrice: responseQuote.c,
      pollingInterval: normalizedQuote.pollingInterval, // not testing it here
      changePercentage: 0,
    });
  });

  it("Should normalize quotes with the last price", () => {
    const url = 'https://finnhub.io/api/v1/quote?symbol=AAPL&token=c3rc512ad3i88nmlp6r0';
    const responseQuote = {
      c: 165.0,
      h: 149.83,
      l: 147.7,
      o: 148.27,
      pc: 148.56,
      t: 1627329602,
    }
    const lastPrice = 150;
    const normalizedQuote = service.normalizeQuote(url, lastPrice)(responseQuote);
    expect(normalizedQuote).toEqual({
      symbol: 'AAPL',
      url,
      openPrice: responseQuote.o,
      highPrice: responseQuote.h,
      lowPrice: responseQuote.l,
      currentPrice: responseQuote.c,
      previousClosePrice: responseQuote.pc,
      pollingTimestamp: responseQuote.t,
      lastPrice: lastPrice,
      pollingInterval: normalizedQuote.pollingInterval, // not testing it here
      changePercentage: 10,
    });
  });

  it("Should use the high frequency polling interval when it has a change percentage larger than 3", () => {
    const pollingInterval = service.calculatePollingInterval(3.01);
    expect(pollingInterval).toBe(2000);
  });

  it("Should use the low frequency polling interval when it has a change percentage smaller than 3", () => {
    const pollingInterval = service.calculatePollingInterval(2.99);
    expect(pollingInterval).toBe(15000);
  });
});
