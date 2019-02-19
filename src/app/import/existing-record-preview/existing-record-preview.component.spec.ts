import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingRecordPreviewComponent } from './existing-record-preview.component';

describe('ExistingRecordPreviewComponent', () => {
  let component: ExistingRecordPreviewComponent;
  let fixture: ComponentFixture<ExistingRecordPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingRecordPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingRecordPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
