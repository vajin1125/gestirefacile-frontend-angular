import { TestBed } from '@angular/core/testing';

import { FirstnoteService } from './firstnote.service';

describe('FirstnoteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirstnoteService = TestBed.get(FirstnoteService);
    expect(service).toBeTruthy();
  });
});
