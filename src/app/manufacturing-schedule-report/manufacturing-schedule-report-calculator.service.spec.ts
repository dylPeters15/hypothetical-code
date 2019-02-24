import { TestBed } from '@angular/core/testing';

import { ManufacturingScheduleReportCalculatorService } from './manufacturing-schedule-report-calculator.service';

describe('ManufacturingScheduleReportCalculatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManufacturingScheduleReportCalculatorService = TestBed.get(ManufacturingScheduleReportCalculatorService);
    expect(service).toBeTruthy();
  });
});
