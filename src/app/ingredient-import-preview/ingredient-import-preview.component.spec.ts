import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientImportPreviewComponent } from './ingredient-import-preview.component';

describe('IngredientImportPreviewComponent', () => {
  let component: IngredientImportPreviewComponent;
  let fixture: ComponentFixture<IngredientImportPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientImportPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientImportPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
