import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableGoalsDialogComponent } from './enable-goals-dialog.component';

describe('EnableGoalsDialogComponent', () => {
  let component: EnableGoalsDialogComponent;
  let fixture: ComponentFixture<EnableGoalsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnableGoalsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnableGoalsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
