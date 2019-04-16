import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuDetailsDialogComponent } from './sku-info-dialog.component';

describe('SkuDetailsDialogComponent', () => {
  let component: SkuDetailsDialogComponent;
  let fixture: ComponentFixture<SkuDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkuDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkuDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
