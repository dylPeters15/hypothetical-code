import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSkuDialogComponent } from './new-formula-dialog.component';

describe('NewSkuDialogComponent', () => {
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
