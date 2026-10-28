import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Research } from './research';

describe('Research', () => {
  let component: Research;

  beforeEach(() => {
    const fixture = TestBed.overrideComponent(Research, {
      set: { schemas: [NO_ERRORS_SCHEMA] },
    }).createComponent(Research);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose publications from ContentService', () => {
    expect(component.publications.length).toBeGreaterThanOrEqual(1);
    expect(component.publications[0].title).toBeTruthy();
  });

  it('should have translations signal', () => {
    expect(component.t().research.title).toBeTruthy();
  });
});
