import { TestBed } from '@angular/core/testing';

import { GameCalculationService } from './game-calculation.service';

describe('GameCalculationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameCalculationService = TestBed.get(GameCalculationService);
    expect(service).toBeTruthy();
  });
});
