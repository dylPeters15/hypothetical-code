import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordCompareDialogComponent } from './record-compare-dialog.component';

describe('RecordCompareDialogComponent', () => {
  let component: RecordCompareDialogComponent;
  let fixture: ComponentFixture<RecordCompareDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordCompareDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordCompareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
