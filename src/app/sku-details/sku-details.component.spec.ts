import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuDetailsComponent } from './sku-details.component';

describe('SkuDetailsComponent', () => {
  let component: SkuDetailsComponent;
  let fixture: ComponentFixture<SkuDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkuDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkuDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
