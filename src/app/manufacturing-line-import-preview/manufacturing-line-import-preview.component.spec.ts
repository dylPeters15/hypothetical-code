import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturingLineImportPreviewComponent } from './manufacturing-line-import-preview.component';

describe('ManufacturingLineImportPreviewComponent', () => {
  let component: ManufacturingLineImportPreviewComponent;
  let fixture: ComponentFixture<ManufacturingLineImportPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturingLineImportPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturingLineImportPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
