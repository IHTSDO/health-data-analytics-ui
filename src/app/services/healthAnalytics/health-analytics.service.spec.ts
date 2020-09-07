import { TestBed } from '@angular/core/testing';

import { HealthAnalyticsService } from './health-analytics.service';

describe('HealthAnalyticsService', () => {
  let service: HealthAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
