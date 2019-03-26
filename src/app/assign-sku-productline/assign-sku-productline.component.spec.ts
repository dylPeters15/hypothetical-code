import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSkuProductlineComponent } from './new-sku-formula.component';

describe('AssignSkuProductlineComponent', () => {
  let component: AssignSkuProductlineComponent;
  let fixture: ComponentFixture<AssignSkuProductlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignSkuProductlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignSkuProductlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
