import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseProductLineDialogComponent } from './choose-product-line-dialog.component';

describe('ChooseProductLineDialogComponent', () => {
  let component: ChooseProductLineDialogComponent;
  let fixture: ComponentFixture<ChooseProductLineDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseProductLineDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseProductLineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
