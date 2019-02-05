import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientInventoryComponent } from './ingredient-inventory.component';

describe('ManufacturingCalculatorComponent', () => {
  let component: IngredientInventoryComponent;
  let fixture: ComponentFixture<IngredientInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});