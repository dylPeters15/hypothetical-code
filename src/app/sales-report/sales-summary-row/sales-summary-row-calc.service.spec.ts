import { TestBed } from '@angular/core/testing';

import { SalesSummaryRowCalcService } from './sales-summary-row-calc.service';

describe('SalesSummaryRowCalcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesSummaryRowCalcService = TestBed.get(SalesSummaryRowCalcService);
    expect(service).toBeTruthy();
  });
});
