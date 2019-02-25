import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPreviewSectionComponent } from './import-preview-section.component';

describe('ImportPreviewSectionComponent', () => {
  let component: ImportPreviewSectionComponent;
  let fixture: ComponentFixture<ImportPreviewSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportPreviewSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportPreviewSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
