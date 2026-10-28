import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ZcNavDesktop } from './zc-nav-desktop';

describe('ZcNavDesktop', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList);
  });

  it('should create', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideRouter([])],
    })
      .overrideComponent(ZcNavDesktop, { set: { schemas: [NO_ERRORS_SCHEMA] } })
      .createComponent(ZcNavDesktop);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have translations signal', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideRouter([])],
    })
      .overrideComponent(ZcNavDesktop, { set: { schemas: [NO_ERRORS_SCHEMA] } })
      .createComponent(ZcNavDesktop);
    fixture.detectChanges();
    expect(fixture.componentInstance.t()).toBeTruthy();
  });
});
