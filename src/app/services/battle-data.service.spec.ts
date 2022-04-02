import { TestBed } from '@angular/core/testing';

import { BattleDataService } from './battle-data.service';

describe('BattleDataService', () => {
  let service: BattleDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BattleDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
