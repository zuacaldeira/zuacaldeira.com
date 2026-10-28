import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PraesentationenList } from './praesentationen-list';

describe('PraesentationenList', () => {
  it('should create', () => {
    const fixture = TestBed.overrideComponent(PraesentationenList, {
      set: { schemas: [NO_ERRORS_SCHEMA] },
    }).createComponent(PraesentationenList);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose praesentationen array', () => {
    const fixture = TestBed.overrideComponent(PraesentationenList, {
      set: { schemas: [NO_ERRORS_SCHEMA] },
    }).createComponent(PraesentationenList);
    fixture.detectChanges();
    expect(Array.isArray(fixture.componentInstance.praesentationen)).toBe(true);
  });
});
