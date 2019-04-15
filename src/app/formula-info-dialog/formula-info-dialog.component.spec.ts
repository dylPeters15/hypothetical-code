import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFormulaDialogComponent } from './new-formula-dialog.component';

describe('NewFOrmulaDialogComponent', () => {
  let component: NewFormulaDialogComponent;
  let fixture: ComponentFixture<NewFormulaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewFormulaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFormulaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
