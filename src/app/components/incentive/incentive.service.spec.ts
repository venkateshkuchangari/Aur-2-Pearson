import { TestBed, inject } from '@angular/core/testing';

import { IncentiveService } from './incentive.service';

describe('IncentiveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IncentiveService]
    });
  });

  it('should be created', inject([IncentiveService], (service: IncentiveService) => {
    expect(service).toBeTruthy();
  }));
});
