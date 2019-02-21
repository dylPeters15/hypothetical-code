import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturingScheduleComponent } from './manufacturing-schedule.component';

describe('ManufacturingScheduleComponent', () => {
  let component: ManufacturingScheduleComponent;
  let fixture: ComponentFixture<ManufacturingScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturingScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturingScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
