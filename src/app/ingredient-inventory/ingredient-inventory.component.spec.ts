import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientInventoryComponent } from './ingredient-inventory.component';
import { AppModule } from '../app.module';

describe('IngredientInventoryComponent', () => {
  let component: IngredientInventoryComponent;
  let fixture: ComponentFixture<IngredientInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule
      ]
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