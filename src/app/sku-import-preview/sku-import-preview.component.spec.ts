import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuImportPreviewComponent } from './sku-import-preview.component';

describe('SkuImportPreviewComponent', () => {
  let component: SkuImportPreviewComponent;
  let fixture: ComponentFixture<SkuImportPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkuImportPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkuImportPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
