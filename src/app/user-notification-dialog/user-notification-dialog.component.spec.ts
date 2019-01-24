import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNotificationDialogComponent } from './user-notification-dialog.component';

describe('UserNotificationDialogComponent', () => {
  let component: UserNotificationDialogComponent;
  let fixture: ComponentFixture<UserNotificationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserNotificationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
