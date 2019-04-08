import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesProjectionComponent } from './sales-projection.component';

describe('SalesProjectionComponent', () => {
  let component: SalesProjectionComponent;
  let fixture: ComponentFixture<SalesProjectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesProjectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesProjectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
