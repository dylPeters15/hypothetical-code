import { TestBed } from '@angular/core/testing';

import { SalesReportCalcService } from './sales-report-calc.service';

describe('SalesReportCalcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesReportCalcService = TestBed.get(SalesReportCalcService);
    expect(service).toBeTruthy();
  });
});
