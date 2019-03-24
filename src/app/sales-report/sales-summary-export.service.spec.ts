import { TestBed } from '@angular/core/testing';

import { SalesSummaryExportService } from './sales-summary-export.service';

describe('SalesSummaryExportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesSummaryExportService = TestBed.get(SalesSummaryExportService);
    expect(service).toBeTruthy();
  });
});
