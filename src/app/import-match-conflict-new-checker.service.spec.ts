import { TestBed } from '@angular/core/testing';

import { ImportMatchConflictNewCheckerService } from './import-match-conflict-new-checker.service';

describe('ImportMatchConflictNewCheckerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImportMatchConflictNewCheckerService = TestBed.get(ImportMatchConflictNewCheckerService);
    expect(service).toBeTruthy();
  });
});
