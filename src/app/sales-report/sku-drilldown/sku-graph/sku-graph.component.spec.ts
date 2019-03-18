import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuGraphComponent } from './sku-graph.component';

describe('SkuGraphComponent', () => {
  let component: SkuGraphComponent;
  let fixture: ComponentFixture<SkuGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkuGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkuGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
