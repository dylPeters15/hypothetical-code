import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFormulaIngredientDialogComponent } from './new-formula-ingredient-dialog.component';

describe('NewFormulaIngredientDialogComponent', () => {
  let component: NewFormulaIngredientDialogComponent;
  let fixture: ComponentFixture<NewFormulaIngredientDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewFormulaIngredientDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFormulaIngredientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
