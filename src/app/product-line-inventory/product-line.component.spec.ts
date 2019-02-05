import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLineInventoryComponent } from './product-line.component';

describe('ManufacturingCalculatorComponent', () => {
  let component: ProductLineInventoryComponent;
  let fixture: ComponentFixture<ProductLineInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLineInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLineInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});