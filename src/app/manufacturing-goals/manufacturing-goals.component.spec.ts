import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturingGoalsComponent } from './manufacturing-goals.component';

describe('ManufacturingGoalsComponent', () => {
  let component: ManufacturingGoalsComponent;
  let fixture: ComponentFixture<ManufacturingGoalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturingGoalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturingGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
