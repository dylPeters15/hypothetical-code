import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordImportPreviewComponent } from './record-import-preview.component';

describe('RecordImportPreviewComponent', () => {
  let component: RecordImportPreviewComponent;
  let fixture: ComponentFixture<RecordImportPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordImportPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordImportPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
