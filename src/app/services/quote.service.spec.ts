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
});
