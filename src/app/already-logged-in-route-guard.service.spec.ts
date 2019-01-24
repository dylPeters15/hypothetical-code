import { TestBed } from '@angular/core/testing';

import { AlreadyLoggedInRouteGuardService } from './already-logged-in-route-guard.service';

describe('AlreadyLoggedInRouteGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlreadyLoggedInRouteGuardService = TestBed.get(AlreadyLoggedInRouteGuardService);
    expect(service).toBeTruthy();
  });
});
