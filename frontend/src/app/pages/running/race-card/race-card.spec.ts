import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RaceCard } from './race-card';
import { Race } from '../../../models/models';

describe('RaceCard', () => {
  const mockRace: Race = {
    name: 'Test Marathon',
    date: '2026-09-27',
    distance: '42.195 km',
    location: 'Berlin',
    upcoming: true,
  };

  it('should create with race input', () => {
    const fixture = TestBed.overrideComponent(RaceCard, {
      set: { schemas: [NO_ERRORS_SCHEMA] },
    }).createComponent(RaceCard);
    fixture.componentInstance.race = mockRace;
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should accept a race input', () => {
    const fixture = TestBed.overrideComponent(RaceCard, {
      set: { schemas: [NO_ERRORS_SCHEMA] },
    }).createComponent(RaceCard);
    fixture.componentInstance.race = mockRace;
    fixture.detectChanges();
    expect(fixture.componentInstance.race).toBe(mockRace);
  });
});
