import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturingCalculatorComponent } from './manufacturing-calculator.component';

describe('ManufacturingCalculatorComponent', () => {
  let component: ManufacturingCalculatorComponent;
  let fixture: ComponentFixture<ManufacturingCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturingCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturingCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
