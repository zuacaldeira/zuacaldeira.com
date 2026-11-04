import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ZcNavDesktop } from './zc-nav-desktop';
import { I18nService } from '../../../services/i18n.service';

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

  it('SHELL-04: links the logo to /de/home and the contact button to /de/contact on a German page', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).overrideComponent(ZcNavDesktop, { set: { schemas: [NO_ERRORS_SCHEMA] } });
    TestBed.inject(I18nService).setLanguage('de');
    const fixture = TestBed.createComponent(ZcNavDesktop);
    await fixture.whenStable();
    const href = (selector: string) =>
      (fixture.nativeElement as HTMLElement).querySelector(selector)?.getAttribute('href');
    expect([href('a.logo'), href('a.nav-cta')]).toEqual(['/de/home', '/de/contact']);
  });

  it('SHELL-01: shows EN, DE and PT in the header', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).overrideComponent(ZcNavDesktop, { set: { schemas: [NO_ERRORS_SCHEMA] } });
    const fixture = TestBed.createComponent(ZcNavDesktop);
    await fixture.whenStable();
    const codes = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll('header app-language-links a'),
    ].map((a) => a.textContent?.trim());
    expect(codes).toEqual(['EN', 'DE', 'PT']);
  });
});
