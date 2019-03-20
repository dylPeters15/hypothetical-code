import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesSummaryRowComponent } from './sales-summary-row.component';

describe('SalesSummaryRowComponent', () => {
  let component: SalesSummaryRowComponent;
  let fixture: ComponentFixture<SalesSummaryRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesSummaryRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesSummaryRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
