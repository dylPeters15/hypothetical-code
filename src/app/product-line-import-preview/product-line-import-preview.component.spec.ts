import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLineImportPreviewComponent } from './product-line-import-preview.component';

describe('ProductLineImportPreviewComponent', () => {
  let component: ProductLineImportPreviewComponent;
  let fixture: ComponentFixture<ProductLineImportPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLineImportPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLineImportPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
