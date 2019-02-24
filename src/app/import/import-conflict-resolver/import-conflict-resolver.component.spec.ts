import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportConflictResolverComponent } from './import-conflict-resolver.component';

describe('ImportConflictResolverComponent', () => {
  let component: ImportConflictResolverComponent;
  let fixture: ComponentFixture<ImportConflictResolverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportConflictResolverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportConflictResolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
