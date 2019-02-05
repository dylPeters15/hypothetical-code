import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGoalDialogComponent } from './new-goal-dialog.component';

describe('NewGoalDialogComponent', () => {
  let component: NewGoalDialogComponent;
  let fixture: ComponentFixture<NewGoalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewGoalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGoalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
