import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIngredientDialogComponent } from './new-ingredient-dialog.component';

describe('NewIngredientDialogComponent', () => {
  let component: NewIngredientDialogComponent;
  let fixture: ComponentFixture<NewIngredientDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewIngredientDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewIngredientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
