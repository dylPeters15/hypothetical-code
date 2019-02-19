import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturingLinesComponent } from './manufacturing-lines.component';

describe('ManufacturingLinesComponent', () => {
  let component: ManufacturingLinesComponent;
  let fixture: ComponentFixture<ManufacturingLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturingLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturingLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
