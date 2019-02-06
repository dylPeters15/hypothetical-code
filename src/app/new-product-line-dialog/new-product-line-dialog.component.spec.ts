import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductLineDialogComponent } from './new-product-line-dialog.component';

describe('NewProductLineDialogComponent', () => {
  let component: NewProductLineDialogComponent;
  let fixture: ComponentFixture<NewProductLineDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProductLineDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProductLineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
