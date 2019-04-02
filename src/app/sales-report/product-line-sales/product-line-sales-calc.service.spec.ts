import { TestBed } from '@angular/core/testing';

import { ProductLineSalesCalcService } from './product-line-sales-calc.service';

describe('ProductLineSalesCalcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductLineSalesCalcService = TestBed.get(ProductLineSalesCalcService);
    expect(service).toBeTruthy();
  });
});
