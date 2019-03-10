import { TestBed } from '@angular/core/testing';

import { SkuDrilldownCalcService } from './sku-drilldown-calc.service';

describe('SkuDrilldownCalcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SkuDrilldownCalcService = TestBed.get(SkuDrilldownCalcService);
    expect(service).toBeTruthy();
  });
});
