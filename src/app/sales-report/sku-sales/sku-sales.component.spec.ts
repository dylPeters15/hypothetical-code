import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuSalesComponent } from './sku-sales.component';

describe('SkuSalesComponent', () => {
  let component: SkuSalesComponent;
  let fixture: ComponentFixture<SkuSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkuSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkuSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
