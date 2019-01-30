import { TestBed } from '@angular/core/testing';

import { UserRouteGuardService } from './user-route-guard.service';
import { AppModule } from './app.module';

describe('UserRouteGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      AppModule
    ]
  }));

  it('should be created', () => {
    const service: UserRouteGuardService = TestBed.get(UserRouteGuardService);
    expect(service).toBeTruthy();
  });
});
