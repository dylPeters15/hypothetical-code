import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaImportPreviewComponent } from './formula-import-preview.component';

describe('FormulaImportPreviewComponent', () => {
  let component: FormulaImportPreviewComponent;
  let fixture: ComponentFixture<FormulaImportPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaImportPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaImportPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
