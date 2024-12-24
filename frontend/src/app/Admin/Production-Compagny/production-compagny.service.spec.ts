import { TestBed } from '@angular/core/testing';

import { ProductionCompagnyService } from './production-compagny.service';

describe('ProductionCompagnyService', () => {
  let service: ProductionCompagnyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionCompagnyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
