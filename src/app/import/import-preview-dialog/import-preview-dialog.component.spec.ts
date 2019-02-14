import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPreviewDialogComponent } from './import-preview-dialog.component';

describe('ImportPreviewDialogComponent', () => {
  let component: ImportPreviewDialogComponent;
  let fixture: ComponentFixture<ImportPreviewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportPreviewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
