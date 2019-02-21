import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturingScheduleReportIngredientTableComponent } from './manufacturing-schedule-report-ingredient-table.component';

describe('ManufacturingScheduleReportIngredientTableComponent', () => {
  let component: ManufacturingScheduleReportIngredientTableComponent;
  let fixture: ComponentFixture<ManufacturingScheduleReportIngredientTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturingScheduleReportIngredientTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturingScheduleReportIngredientTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
