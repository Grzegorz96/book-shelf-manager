import { TestBed } from '@angular/core/testing';

import { BooksApi } from './books.api';

describe('BooksApi', () => {
  let service: BooksApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BooksApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
