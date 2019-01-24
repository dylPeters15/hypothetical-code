import { TestBed } from '@angular/core/testing';

import { SidenavServiceService } from './sidenav-service.service';

describe('SidenavServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SidenavServiceService = TestBed.get(SidenavServiceService);
    expect(service).toBeTruthy();
  });
});
