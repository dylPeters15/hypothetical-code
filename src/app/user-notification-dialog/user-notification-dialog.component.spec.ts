import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNotificationDialogComponent } from './user-notification-dialog.component';
import { AppModule } from '../app.module';

describe('UserNotificationDialogComponent', () => {
  let component: UserNotificationDialogComponent;
  let fixture: ComponentFixture<UserNotificationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
