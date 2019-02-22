import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturingScheduleReportLineTableComponent } from './manufacturing-schedule-report-line-table.component';

describe('ManufacturingScheduleReportLineTableComponent', () => {
  let component: ManufacturingScheduleReportLineTableComponent;
  let fixture: ComponentFixture<ManufacturingScheduleReportLineTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturingScheduleReportLineTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturingScheduleReportLineTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
