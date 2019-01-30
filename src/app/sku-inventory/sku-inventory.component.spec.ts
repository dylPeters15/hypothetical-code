import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuInventoryComponent } from './sku-inventory.component';

describe('ManufacturingCalculatorComponent', () => {
  let component: SkuInventoryComponent;
  let fixture: ComponentFixture<SkuInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkuInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkuInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});