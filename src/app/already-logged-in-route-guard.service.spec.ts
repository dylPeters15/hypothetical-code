import { TestBed } from '@angular/core/testing';

import { AlreadyLoggedInRouteGuardService } from './already-logged-in-route-guard.service';
import { AppModule } from './app.module';

describe('AlreadyLoggedInRouteGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      AppModule
    ]
  }));

  it('should be created', () => {
    const service: AlreadyLoggedInRouteGuardService = TestBed.get(AlreadyLoggedInRouteGuardService);
    expect(service).toBeTruthy();
  });
});
