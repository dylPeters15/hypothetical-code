import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientDependencyComponent } from './ingredient-dependency-report.component';

describe('ManufacturingCalculatorComponent', () => {
  let component: IngredientDependencyComponent;
  let fixture: ComponentFixture<IngredientDependencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientDependencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientDependencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});