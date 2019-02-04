import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSkuDialogComponent } from './new-sku-dialog.component';

describe('NewSkuDialogComponent', () => {
  let component: NewSkuDialogComponent;
  let fixture: ComponentFixture<NewSkuDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSkuDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSkuDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
