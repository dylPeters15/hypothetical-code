import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturingScheduleReportComponent } from './manufacturing-schedule-report.component';

describe('ManufacturingScheduleReportComponent', () => {
  let component: ManufacturingScheduleReportComponent;
  let fixture: ComponentFixture<ManufacturingScheduleReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturingScheduleReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturingScheduleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
