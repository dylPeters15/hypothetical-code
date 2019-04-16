import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaDetailsDialogComponent } from './formula-info-dialog.component';

describe('FormulaDetailsDialogComponent', () => {
  let component: FormulaDetailsDialogComponent;
  let fixture: ComponentFixture<FormulaDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
