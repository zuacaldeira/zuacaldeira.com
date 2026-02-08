import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ZcPage } from './zc-page';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';

describe('ZcPage', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList);
  });

  function createComponent(isHandset: boolean) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: BreakpointObserver,
          useValue: {
            observe: () => of({ matches: isHandset } as BreakpointState),
          },
        },
      ],
    }).overrideComponent(ZcPage, { set: { schemas: [NO_ERRORS_SCHEMA] } });
    return TestBed.createComponent(ZcPage);
  }

  it('should create', () => {
    const fixture = createComponent(false);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should emit true for handset breakpoint', async () => {
    const fixture = createComponent(true);
    fixture.detectChanges();
    const isHandset = await firstValueFrom(fixture.componentInstance.isHandset$);
    expect(isHandset).toBe(true);
  });

  it('should emit false for desktop breakpoint', async () => {
    const fixture = createComponent(false);
    fixture.detectChanges();
    const isHandset = await firstValueFrom(fixture.componentInstance.isHandset$);
    expect(isHandset).toBe(false);
  });
});
