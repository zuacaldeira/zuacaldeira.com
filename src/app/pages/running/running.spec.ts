import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Running } from './running';

describe('Running', () => {
  let component: Running;

  beforeEach(() => {
    const fixture = TestBed.overrideComponent(Running, {
      set: { schemas: [NO_ERRORS_SCHEMA] },
    }).createComponent(Running);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should separate upcoming and completed races', () => {
    expect(component.upcomingRaces.length).toBeGreaterThan(0);
    expect(component.completedRaces.length).toBeGreaterThan(0);
  });

  it('should only have upcoming=true in upcomingRaces', () => {
    for (const race of component.upcomingRaces) {
      expect(race.upcoming).toBe(true);
    }
  });

  it('should only have upcoming=false in completedRaces', () => {
    for (const race of component.completedRaces) {
      expect(race.upcoming).toBe(false);
    }
  });

  it('should have all races accounted for', () => {
    const total = component.upcomingRaces.length + component.completedRaces.length;
    expect(total).toBeGreaterThan(0);
  });
});
