import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ThemeToggle } from './theme-toggle';
import { ThemeService } from '../../services/theme.service';

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList);
  });

  it('should create', () => {
    const fixture = TestBed.overrideComponent(ThemeToggle, {
      set: { schemas: [NO_ERRORS_SCHEMA] },
    }).createComponent(ThemeToggle);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should inject ThemeService', () => {
    TestBed.overrideComponent(ThemeToggle, {
      set: { schemas: [NO_ERRORS_SCHEMA] },
    }).createComponent(ThemeToggle);
    const themeService = TestBed.inject(ThemeService);
    expect(themeService).toBeTruthy();
  });
});
