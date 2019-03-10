import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuDrilldownComponent } from './sku-drilldown.component';

describe('SkuDrilldownComponent', () => {
  let component: SkuDrilldownComponent;
  let fixture: ComponentFixture<SkuDrilldownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkuDrilldownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkuDrilldownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
