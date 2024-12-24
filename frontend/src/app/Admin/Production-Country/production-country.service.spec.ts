import { TestBed } from '@angular/core/testing';

import { ProductionCountryService } from './production-country.service';

describe('ProductionCountryService', () => {
  let service: ProductionCountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionCountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
