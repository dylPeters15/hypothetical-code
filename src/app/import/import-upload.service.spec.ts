import { TestBed } from '@angular/core/testing';

import { ImportUploadService } from './import-upload.service';

describe('ImportUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImportUploadService = TestBed.get(ImportUploadService);
    expect(service).toBeTruthy();
  });
});
