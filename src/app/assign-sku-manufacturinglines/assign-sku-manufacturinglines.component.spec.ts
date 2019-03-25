import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSkuManufacturingLines } from './assign-sku-manufacturinglines.component';

describe('AssignSkuManufacturingLines', () => {
  let component: AssignSkuManufacturingLines;
  let fixture: ComponentFixture<AssignSkuManufacturingLines>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignSkuManufacturingLines ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignSkuManufacturingLines);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
