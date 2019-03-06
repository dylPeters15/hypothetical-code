import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLineSalesComponent } from './product-line-sales.component';

describe('ProductLineSalesComponent', () => {
  let component: ProductLineSalesComponent;
  let fixture: ComponentFixture<ProductLineSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLineSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLineSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
