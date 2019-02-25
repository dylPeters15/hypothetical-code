import { TestBed } from '@angular/core/testing';

import { ParseCsvService } from './parse-csv.service';

describe('ParseCsvService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParseCsvService = TestBed.get(ParseCsvService);
    expect(service).toBeTruthy();
  });

  // it('should return true', () => {
  //   const service: ParseCsvService = TestBed.get(ParseCsvService);
  //   expect(service.parseCSVFile("asdf")).toBeTruthy();
  // });
});
