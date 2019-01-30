import { TestBed } from '@angular/core/testing';

import { RestService } from './rest.service';
import { AppModule } from './app.module';

describe('RestService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      AppModule
    ]
  }));

  it('should be created', () => {
    const service: RestService = TestBed.get(RestService);
    expect(service).toBeTruthy();
  });
});
