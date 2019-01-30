import { TestBed } from '@angular/core/testing';

import { AdminRouteGuardService } from './admin-route-guard.service';
import { AppModule } from './app.module';

describe('AdminRouteGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      AppModule
    ]
  }));

  it('should be created', () => {
    const service: AdminRouteGuardService = TestBed.get(AdminRouteGuardService);
    expect(service).toBeTruthy();
  });
});
