import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsAndQuantitiesDialogComponent } from './ingredients-and-quantities-dialog.component';

describe('IngredientsAndQuantitiesDialogComponent', () => {
  let component: IngredientsAndQuantitiesDialogComponent;
  let fixture: ComponentFixture<IngredientsAndQuantitiesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientsAndQuantitiesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientsAndQuantitiesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
