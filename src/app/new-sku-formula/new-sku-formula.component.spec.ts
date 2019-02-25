import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSkuFormulaComponent } from './new-sku-formula.component';

describe('NewSkuFormulaComponent', () => {
  let component: NewSkuFormulaComponent;
  let fixture: ComponentFixture<NewSkuFormulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSkuFormulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSkuFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
