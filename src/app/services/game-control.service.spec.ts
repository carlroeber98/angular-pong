import { TestBed } from '@angular/core/testing';

import { GameControlService } from './game-control.service';

describe('GameControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameControlService = TestBed.get(GameControlService);
    expect(service).toBeTruthy();
  });
});
